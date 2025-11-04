import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { DEFAULT_JOB_OPTIONS } from "../configs";
import { CertificateEventJobs, CertificateJobPrefix, QueueNames } from "../enums";
import { CertificateSignedEventJob } from "../interfaces";

@Injectable()
export class CertificateEventQueueService {
  private readonly logger = new Logger(CertificateEventQueueService.name);

  constructor(
    @InjectQueue(QueueNames.CERTIFICATE_EVENTS)
    private readonly certificateEventQueue: Queue,
  ) { }

  async addCertificateSignedEvent(eventData: CertificateSignedEventJob): Promise<void> {
    const jobId = `${CertificateJobPrefix.CERTIFICATE_SIGNED}-${eventData.transactionHash}`;
    const existingJob = await this.certificateEventQueue.getJob(jobId);
    if (existingJob) {
      this.logger.warn(`Certificate signed job ${jobId} already exists. Skipped`);
      return;
    }

    await this.certificateEventQueue.add(CertificateEventJobs.CERTIFICATE_SIGNED, eventData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });
    this.logger.log(`Certificate signed job for: ${eventData.certificateId}`);
  }
}