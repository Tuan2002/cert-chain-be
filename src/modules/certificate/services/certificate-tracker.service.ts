import { FileType, StorageFolders } from "@/base/enums";
import { CertificateMailQueueService } from "@/modules/queue/services";
import { S3FileService } from "@/modules/third-party/services";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import QRCode from "qrcode";
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
    private readonly certificateMailQueueService: CertificateMailQueueService,
    private readonly s3FileService: S3FileService,
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
      },

      relations: {
        organization: true,
        certificateProfile: true,
        certificateType: true,
      }
    });

    if (existingCert.status === CertificateStatus.VERIFIED) {
      return;
    }

    const qrCodeBuffer = await QRCode.toBuffer(`${process.env.APP_URL}/certificates/${existingCert.code}`);
    const qrCodeKey = `${StorageFolders.CERTIFICATES}/${existingCert.code}-qr.png`;
    const qrCodeUrl = await this.s3FileService.uploadBuffer(
      qrCodeBuffer,
      qrCodeKey,
      FileType.IMAGE_PNG
    );

    await this.certificateMailQueueService.addSendCertificateApprovedEmailJob({
      to: existingCert.certificateProfile.authorEmail,
      recipientName: existingCert.certificateProfile.authorName,
      certificateType: existingCert.certificateType.name,
      organizationName: existingCert.organization.name,
      approvedAt: dayjs().toDate(),
      validFrom: existingCert.validFrom,
      validTo: existingCert.validTo,
      certificateCode: existingCert.code,
      qrCodeUrl,
      approvalTxHash: transactionHash,
    });

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