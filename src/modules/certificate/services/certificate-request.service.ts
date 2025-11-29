import { QueryOptionsHelper } from "@/base/decorators";
import { QueryOptionsDto } from "@/base/dtos";
import { parseFilterQuery } from "@/base/utils/filter-query.util";
import { parseSortQuery } from "@/base/utils/sort-query.util";
import { CertificateContractService } from "@/modules/web-three/services";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CertificateRequestErrorCode } from "../constants";
import { CertificateRequestDto, RejectCertificateRequestDto, RequestCertificateDto } from "../dto";
import { Certificate, CertificateRequest } from "../entities";
import { RequestStatus, RequestType } from "../enums";

@Injectable()
export class CertificateRequestService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(CertificateRequest)
    private readonly certificateRequestRepository: Repository<CertificateRequest>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly certificateContractService: CertificateContractService
  ) { }

  async createCertificateRequest(requestData: RequestCertificateDto): Promise<CertificateRequestDto> {
    const { requestType, certificateId } = requestData;
    const hasPendingRequest = await this.certificateRequestRepository.exists({
      where: {
        certificateId,
        status: RequestStatus.PENDING
      }
    });

    if (hasPendingRequest) {
      throw new BadRequestException({
        message: 'There is already a pending certificate request for this certificate',
        code: CertificateRequestErrorCode.HAVE_PENDING_CERTIFICATE_REQUEST
      })
    }
    const submitCertificate = await this.certificateRepository.findOneOrFail({
      where: {
        id: certificateId
      }
    });

    const newRequest = this.certificateRequestRepository.create({
      requestType,
      certificateId,
      organizationId: submitCertificate.organizationId
    });
    const savedRequest = await this.certificateRequestRepository.save(newRequest);

    return plainToInstance(CertificateRequestDto, savedRequest, {
      excludeExtraneousValues: true
    });
  }

  async getCertificateRequests(queryOptionsDto: QueryOptionsDto, certificateId?: string) {
    const { getPagination, skip, take, sort, filters } =
      new QueryOptionsHelper(queryOptionsDto, {
        keepRawFilters: true
      });

    const [rawCertificateRequests, count] = await this.certificateRequestRepository
      .findAndCount({
        skip,
        take,
        where: {
          ...(
            certificateId ? { certificateId } : {}
          ),
          ...parseFilterQuery<CertificateRequest>(filters)
        },
        order: sort ? parseSortQuery<CertificateRequest>(sort) : { createdAt: 'DESC' },
        relations: {
          organization: true,
          certificate: {
            certificateType: true,
            certificateProfile: true
          }
        }
      });

    const resPagination = getPagination({
      count,
      total: rawCertificateRequests.length,
    });

    const certificateRequests = rawCertificateRequests.map((certificateRequest) =>
      plainToInstance(CertificateRequestDto, {
        ...certificateRequest,
        certificate: {
          ...certificateRequest.certificate,
          authorProfile: certificateRequest?.certificate?.certificateProfile
        },
        organization: certificateRequest.organization
      }, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: certificateRequests,
      pagination: resPagination,
    };
  }

  async getCertificateRequestById(id: string): Promise<CertificateRequestDto> {
    const certificateRequest = await this.certificateRequestRepository.findOne({
      where: { id },
      relations: {
        organization: true,
        certificate: {
          certificateType: true,
          certificateProfile: true
        }
      }
    });

    if (!certificateRequest) {
      throw new BadRequestException({
        message: 'Certificate request not found',
        code: CertificateRequestErrorCode.CERTIFICATE_REQUEST_NOT_FOUND
      });
    }

    return plainToInstance(CertificateRequestDto, {
      ...certificateRequest,
      certificate: {
        ...certificateRequest.certificate,
        authorProfile: certificateRequest?.certificate?.certificateProfile
      },
      organization: certificateRequest.organization
    }, {
      excludeExtraneousValues: true
    });
  }

  async approveCertificateRequest(id: string): Promise<{ id: string }> {
    const certificateRequest = await this.certificateRequestRepository.findOne({
      where: {
        id,
        status: RequestStatus.PENDING
      },
    });

    if (!certificateRequest) {
      throw new BadRequestException({
        message: 'Certificate request not found or is not pending',
        code: CertificateRequestErrorCode.CERTIFICATE_REQUEST_NOT_FOUND
      });
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      await manager.update(CertificateRequest, { id }, {
        status: RequestStatus.PROCESSED
      });

      switch (certificateRequest.requestType) {
        case RequestType.SIGNUP:
          await this.certificateContractService.approveCertificateRequestAsync(
            certificateRequest.certificateId
          );
          break;
        case RequestType.REVOKE:
          await this.certificateContractService.revokeCertificateAsync(
            certificateRequest.certificateId,
            certificateRequest?.revokeReason || 'This certificate has been revoked by organization'
          );
          break;
        default:
          throw new BadRequestException({
            message: 'Invalid request type',
            code: CertificateRequestErrorCode.INVALID_REQUEST_TYPE
          });
      }
    });

    return { id };
  }

  async rejectCertificateRequest(id: string, rejectRequestDto: RejectCertificateRequestDto): Promise<{ id: string }> {
    const certificateRequest = await this.certificateRequestRepository.findOne({
      where: {
        id,
        status: RequestStatus.PENDING
      },
    });

    if (!certificateRequest) {
      throw new BadRequestException({
        message: 'Certificate request not found or is not pending',
        code: CertificateRequestErrorCode.CERTIFICATE_REQUEST_NOT_FOUND
      });
    }

    await this.certificateRequestRepository.update({ id }, {
      status: RequestStatus.PROCESSED,
      rejectionReason: rejectRequestDto?.rejectionReason || 'This certificate request has been rejected by admin'
    });

    return { id };
  }
}