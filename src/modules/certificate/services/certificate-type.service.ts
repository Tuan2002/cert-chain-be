import { QueryOptionsHelper } from "@/base/decorators";
import { QueryOptionsDto } from "@/base/dtos";
import { CertificateTypeContractService } from "@/modules/web-three/services";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { DataSource, EntityManager, ILike, Repository } from "typeorm";
import { CertificateTypeErrorCode } from "../constants";
import { CertificateTypeDto, CreateCertificateTypeDto, UpdateCertificateTypeDto } from "../dto";
import { CertificateType } from "../entities";

@Injectable()
export class CertificateTypeService {
  constructor(
    @InjectRepository(CertificateType)
    private readonly certificateTypeRepository: Repository<CertificateType>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly certificateTypeContractService: CertificateTypeContractService
  ) { }

  async createCertificateTypeAsync(createTypeDto: CreateCertificateTypeDto)
    : Promise<CertificateTypeDto> {
    const existingType = await this.certificateTypeRepository.exists({
      where: {
        code: createTypeDto.code
      }
    });

    if (existingType) {
      throw new BadRequestException({
        message: 'Certificate type with this code already exists',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_ALREADY_EXISTS
      });
    }

    const newCertificateType = await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const certificateType = entityManager.create(CertificateType, {
          ...createTypeDto
        });
        const savedCertificateType = await entityManager.save(certificateType);
        await this.certificateTypeContractService.createCertificateTypeAsync({
          id: savedCertificateType.id,
          code: savedCertificateType.code,
          name: savedCertificateType.name
        });
        return savedCertificateType;
      }
    )

    return plainToInstance(CertificateTypeDto, newCertificateType, {
      excludeExtraneousValues: true,
    });
  }

  async getCertificateTypesAsync(
    queryOptionsDto: QueryOptionsDto
  ) {
    const { getPagination, skip, take, search }
      = new QueryOptionsHelper(queryOptionsDto);

    const [rawCertificateTypes, count] = await this.certificateTypeRepository
      .findAndCount({
        where: search
          ? [
            { name: ILike(search) },
            { code: ILike(search) }
          ]
          : {},
        order: { createdAt: 'DESC' },
        skip,
        take,
      });

    const resPagination = getPagination({
      count,
      total: rawCertificateTypes.length,
    });

    const certificateTypes = rawCertificateTypes.map((certificateType) =>
      plainToInstance(CertificateTypeDto, certificateType, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data: certificateTypes,
      pagination: resPagination,
    };
  }

  async getCertificateTypeByIdAsync(certificateTypeId: string): Promise<CertificateTypeDto> {
    const certificateType = await this.certificateTypeRepository.findOne({
      where: {
        id: certificateTypeId
      }
    });

    if (!certificateType) {
      throw new BadRequestException({
        message: 'Certificate type not found',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_NOT_FOUND
      });
    }

    return plainToInstance(CertificateTypeDto, certificateType, {
      excludeExtraneousValues: true,
    });
  }

  async updateCertificateTypeAsync(
    certificateTypeId: string,
    updateTypeDto: UpdateCertificateTypeDto
  ): Promise<CertificateTypeDto> {
    const existingType = await this.certificateTypeRepository.findOne({
      where: {
        id: certificateTypeId
      }
    });

    if (!existingType) {
      throw new BadRequestException({
        message: 'Certificate type not found',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_NOT_FOUND
      });
    }

    const updatedCertificateType = await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const savedCertificateType = await entityManager.save(CertificateType, {
          ...existingType,
          ...updateTypeDto
        });
        await this.certificateTypeContractService.updateCertificateTypeAsync({
          id: savedCertificateType.id,
          code: savedCertificateType.code,
          name: savedCertificateType.name
        });
        return savedCertificateType;
      }
    );

    return plainToInstance(CertificateTypeDto, updatedCertificateType, {
      excludeExtraneousValues: true,
    });
  }

  async reactivateCertificateTypeAsync(certificateTypeId: string): Promise<{
    certificateTypeId: string;
  }> {
    const existingType = await this.certificateTypeRepository.exists({
      where: { id: certificateTypeId }
    });

    if (!existingType) {
      throw new BadRequestException({
        message: 'Certificate type not found',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_NOT_FOUND
      });
    }

    await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.update(CertificateType, {
          id: certificateTypeId
        }, {
          isActive: true
        });
        await this.certificateTypeContractService.reactivateCertificateTypeAsync(certificateTypeId);
      }
    );
    return { certificateTypeId };
  }

  async deactivateCertificateTypeAsync(certificateTypeId: string): Promise<{
    certificateTypeId: string;
  }> {
    const existingType = await this.certificateTypeRepository.exists({
      where: {
        id: certificateTypeId
      }
    });

    if (!existingType) {
      throw new BadRequestException({
        message: 'Certificate type not found',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_NOT_FOUND
      });
    }

    await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.update(CertificateType, {
          id: certificateTypeId
        }, {
          isActive: false
        });
        await this.certificateTypeContractService.deactivateCertificateTypeAsync(certificateTypeId);
      }
    );
    return { certificateTypeId };
  }

  async deleteCertificateTypeAsync(certificateTypeId: string): Promise<{
    certificateTypeId: string;
  }> {
    const existingType = await this.certificateTypeRepository.exists({
      where: {
        id: certificateTypeId
      }
    });

    if (!existingType) {
      throw new BadRequestException({
        message: 'Certificate type not found',
        code: CertificateTypeErrorCode.CERTIFICATE_TYPE_NOT_FOUND
      });
    }

    await this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.softDelete(CertificateType, {
          id: certificateTypeId
        });
        await this.certificateTypeContractService.deactivateCertificateTypeAsync(certificateTypeId);
      }
    );
    return { certificateTypeId }
  }
}