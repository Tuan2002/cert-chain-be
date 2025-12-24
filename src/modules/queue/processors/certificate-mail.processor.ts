import { CertificateMailService } from "@/modules/mail/services";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CertificateMailJobs, QueueNames } from "../enums";
import { SendCertificateApprovedJob } from "../interfaces";

@Processor(QueueNames.CERTIFICATE_MAILS)
export class CertificateMailProcessor extends WorkerHost {
  private readonly logger = new Logger(CertificateMailProcessor.name);

  constructor(
    private readonly certificateMailService: CertificateMailService
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case CertificateMailJobs.SEND_CERTIFICATE_APPROVED_EMAIL:
        return this.handleSendCertificateApprovedEmailQueue(job.data);

      default:
        this.logger.warn(`No handler for job name: ${job.name}`);
        return;
    }
  }

  private async handleSendCertificateApprovedEmailQueue(
    data: SendCertificateApprovedJob
  ): Promise<void> {
    this.logger.log(`Processing email for approved certificate: ${data.to}`);
    await this.certificateMailService.sendCertificateApprovedAsync({
      to: data.to,
      recipientName: data.recipientName,
      certificateType: data.certificateType,
      organizationName: data.organizationName,
      approvedAt: data.approvedAt,
      validFrom: data.validFrom,
      validTo: data.validTo,
      certificateCode: data.certificateCode,
      qrCodeUrl: data.qrCodeUrl,
      approvalTxHash: data.approvalTxHash,
    });
    this.logger.log(`Processed email for approved certificate: ${data.to}`);
  }
}
