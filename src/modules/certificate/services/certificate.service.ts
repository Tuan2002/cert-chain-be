import { QueryOptionsHelper } from "@/base/decorators";
import { QueryOptionsDto } from "@/base/dtos";
import { parseFilterQuery, parseSortQuery } from "@/base/utils";
import { Organization } from "@/modules/organization/entities";
import { IPFSService } from "@/modules/third-party/services";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { DataSource, EntityManager, ILike, Repository } from "typeorm";
import { CertificateErrorCode } from "../constants";
import { BaseCertificateDto, CertificateDto, CreateCertificateDto } from "../dto";
import { Certificate, CertificateProfile, CertificateType } from "../entities";
import { CertificateHashType } from "../types";
import { generateCertBuffer, generateCertCode } from "../utils";

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly ipfsService: IPFSService
  ) { }

  async createCertificateAsync(issuerId: string, certificateData: CreateCertificateDto): Promise<BaseCertificateDto> {
    const {
      organizationId,
      certificateTypeId,
      validFrom,
      validTo,
      authorProfile
    } = certificateData;

    const [organization, certificateType] = await Promise.all([
      this.dataSource.getRepository(Organization).findOneBy({ id: organizationId }),
      this.dataSource.getRepository(CertificateType).findOneBy({ id: certificateTypeId })
    ]);

    if (!organization || !certificateType) {
      throw new BadRequestException({
        message: 'Invalid organization or certificate type',
        code: CertificateErrorCode.INVALID_ARGUMENTS
      })
    }

    const certificate = this.dataSource.transaction(async (manager: EntityManager) => {
      const { authorDocuments, ...authorProfileData } = authorProfile;

      const certificateCode = generateCertCode();
      const newCertificateProfile = await manager.save(CertificateProfile, {
        ...authorProfile
      });

      const certificateHashData: CertificateHashType = {
        certificateCode: certificateCode,
        organizationName: organization?.name,
        certificateType: certificateType?.name,
        authorProfile: {
          ...authorProfileData
        },
        validFrom: validFrom,
        validTo: validTo
      };

      const bufferData = await generateCertBuffer(certificateHashData);
      const { hash } = await this.ipfsService.uploadDataAsync(bufferData);

      const newCertificate = await manager.save(Certificate, {
        issuerId: issuerId,
        organizationId: organizationId,
        certificateTypeId: certificateTypeId,
        certificateProfileId: newCertificateProfile.id,
        certificateHash: hash,
        code: certificateCode,
        validFrom: validFrom,
        validTo: validTo
      });
      return newCertificate;
    })

    return plainToInstance(CertificateDto, certificate, {
      excludeExtraneousValues: true
    })
  }

  async getCertificatesAsync(queryOptionsDto: QueryOptionsDto, organizationId?: string) {
    const { getPagination, skip, take, search, sort, filters } =
      new QueryOptionsHelper(queryOptionsDto, {
        keepRawFilters: true
      });

    const [rawCertificates, count] = await this.certificateRepository
      .findAndCount({
        skip,
        take,
        where: {
          ...(
            organizationId ? { organizationId } : {}
          ),
          ...(search
            ? { organizationName: ILike(search) }
            : {}),
          ...parseFilterQuery<Certificate>(filters)
        },
        order: sort ? parseSortQuery<Certificate>(sort) : { createdAt: 'DESC' },
        relations: ['certificateType']
      });

    const resPagination = getPagination({
      count,
      total: rawCertificates.length,
    });

    const certificates = rawCertificates.map((certificate) =>
      plainToInstance(CertificateDto, certificate, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: certificates,
      pagination: resPagination,
    };
  }

  async getCertificateByIdAsync(id: string): Promise<CertificateDto> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['certificateType', 'certificateProfile']
    });

    if (!certificate) {
      throw new BadRequestException({
        message: 'Certificate not found',
        code: CertificateErrorCode.CERTIFICATE_NOT_FOUND
      });
    }

    return plainToInstance(CertificateDto, {
      ...certificate,
      authorProfile: certificate.certificateProfile
    }, {
      excludeExtraneousValues: true
    });
  }
}