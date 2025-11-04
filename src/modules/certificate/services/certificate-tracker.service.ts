import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Certificate } from "../entities";
import { CertificateStatus } from "../enums";
import { CertificateSignedEvent } from "../types";

@Injectable()
export class CertificateTrackerService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async handleCertificateSignedEvent(eventData: CertificateSignedEvent): Promise<void> {
    const {
      certificateId,
      transactionHash
    } = eventData;

    const existingCert = await this.certificateRepository.findOneOrFail({
      where: {
        id: certificateId,
      }
    });

    if (existingCert.status === CertificateStatus.SIGNED) {
      return;
    }

    await this.certificateRepository.update({
      id: certificateId
    }, {
      status: CertificateStatus.SIGNED,
      signedTxHash: transactionHash
    });
  }
}