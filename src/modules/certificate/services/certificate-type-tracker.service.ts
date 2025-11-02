import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CertificateType } from "../entities";
import { CertificateTypeCreatedEvent, CertificateTypeDeactivatedEvent, CertificateTypeUpdatedEvent } from "../types";

@Injectable()
export class CertificateTypeTrackerService {
  constructor(
    @InjectRepository(CertificateType)
    private readonly certificateTypeRepository: Repository<CertificateType>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async handleCertificateTypeAddedEvent(eventData: CertificateTypeCreatedEvent): Promise<void> {
    const {
      certificateTypeId,
      transactionHash
    } = eventData;

    const pendingType = await this.certificateTypeRepository.exists({
      where: {
        id: certificateTypeId,
        isActive: false,
      }
    })

    if (!pendingType) {
      throw new Error(`Certificate type with ID ${certificateTypeId} not found or already active`);
    }

    await this.certificateTypeRepository.update({
      id: certificateTypeId
    }, {
      isActive: true,
      initTxHash: transactionHash,
    });
  }

  async handleCertificateTypeUpdatedEvent(eventData: CertificateTypeUpdatedEvent): Promise<void> {
    const {
      certificateTypeId,
      transactionHash
    } = eventData;

    const existingType = await this.certificateTypeRepository.findOne({
      where: {
        id: certificateTypeId,
      }
    });

    if (!existingType) {
      throw new Error(`Certificate type with ID ${certificateTypeId} not found`);
    }

    await this.certificateTypeRepository.update({
      id: certificateTypeId
    }, {
      lastChangedTxHash: transactionHash
    });
  }

  async handleCertificateTypeDeactivatedEvent(eventData: CertificateTypeDeactivatedEvent): Promise<void> {
    const {
      certificateTypeId,
      transactionHash
    } = eventData;
    const existingType = await this.certificateTypeRepository.findOne({
      where: {
        id: certificateTypeId,
      }
    });

    if (!existingType) {
      throw new Error(`Certificate type with ID ${certificateTypeId} not found`);
    }

    await this.certificateTypeRepository.update({
      id: certificateTypeId
    }, {
      isActive: false,
      lastChangedTxHash: transactionHash,
    });
  }
}