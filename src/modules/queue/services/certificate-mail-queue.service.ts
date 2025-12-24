import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { DEFAULT_JOB_OPTIONS } from "../configs";
import { CertificateMailJobs, QueueNames } from "../enums";
import { SendCertificateApprovedJob } from "../interfaces";

@Injectable()
export class CertificateMailQueueService {
  private readonly logger = new Logger(CertificateMailQueueService.name);

  constructor(
    @InjectQueue(QueueNames.CERTIFICATE_MAILS)
    private readonly certificateMailQueue: Queue,
  ) { }

  /**
   * Add a job to send certificate approved email to the queue
   * @param data - Data for the certificate approved email job
   * @returns a Promise that resolves when the job is added
   */
  async addSendCertificateApprovedEmailJob(
    data: SendCertificateApprovedJob
  ): Promise<void> {
    await this.certificateMailQueue.add(
      CertificateMailJobs.SEND_CERTIFICATE_APPROVED_EMAIL,
      data,
      {
        ...DEFAULT_JOB_OPTIONS,
      }
    );
    this.logger.log(
      `Added job to send certificate approved email to queue for: ${data.to}`
    );
  }
}
