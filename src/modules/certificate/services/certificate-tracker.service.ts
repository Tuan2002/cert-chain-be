import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { DataSource, Repository } from "typeorm";
import { Certificate } from "../entities";
import { CertificateStatus } from "../enums";
import { CertificateApprovedEvent, CertificateRevokedEvent, CertificateSignedEvent } from "../types";

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
        code: certificateId,
      }
    });

    if (existingCert.status === CertificateStatus.SIGNED) {
      return;
    }

    await this.certificateRepository.update({
      id: existingCert.id
    }, {
      status: CertificateStatus.SIGNED,
      approvedTxHash: transactionHash,
      approvedAt: dayjs().toDate(),
    });
  }

  async handleCertificateApprovedEvent(eventData: CertificateApprovedEvent): Promise<void> {
    const {
      certificateId,
      transactionHash
    } = eventData;

    const existingCert = await this.certificateRepository.findOneOrFail({
      where: {
        code: certificateId,
      }
    });

    if (existingCert.status === CertificateStatus.VERIFIED) {
      return;
    }

    await this.certificateRepository.update({
      id: existingCert.id
    }, {
      status: CertificateStatus.VERIFIED,
      approvedTxHash: transactionHash,
      approvedAt: dayjs().toDate(),
    });
  }

  async handleCertificateRevokedEvent(eventData: CertificateRevokedEvent): Promise<void> {
    const {
      certificateId,
      transactionHash
    } = eventData;

    const existingCert = await this.certificateRepository.findOneOrFail({
      where: {
        code: certificateId,
      }
    });

    if (existingCert.status === CertificateStatus.REVOKED) {
      return;
    }

    await this.certificateRepository.update({
      id: existingCert.id
    }, {
      status: CertificateStatus.REVOKED,
      revokedAt: dayjs().toDate(),
      revokedTxHash: transactionHash
    });
  }
}