import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CertificateType } from "../entities";
import { CertificateTypeCreatedEvent } from "../types";

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
}