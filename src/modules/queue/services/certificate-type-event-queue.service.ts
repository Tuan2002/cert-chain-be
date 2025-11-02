import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { DEFAULT_JOB_OPTIONS } from "../configs";
import { CertificateTypeEventJobs, CertificateTypeJobPrefix, QueueNames } from "../enums";
import { CertificateTypeCreatedEventJob, CertificateTypeDeactivatedEventJob, CertificateTypeUpdatedEventJob } from "../interfaces";

@Injectable()
export class CertificateTypeEventQueueService {
  private readonly logger = new Logger(CertificateTypeEventQueueService.name);

  constructor(
    @InjectQueue(QueueNames.CERTIFICATE_TYPE_EVENTS)
    private readonly certificateTypeEventQueue: Queue,
  ) { }

  async addOrganizationAddedEvent(eventData: CertificateTypeCreatedEventJob): Promise<void> {
    const jobId = `${CertificateTypeJobPrefix.CERTIFICATE_TYPE_ADDED}-${eventData.transactionHash}`;
    const existingJob = await this.certificateTypeEventQueue.getJob(jobId);
    if (existingJob) {
      this.logger.warn(`Certificate type created job ${jobId} already exists. Skipped`);
      return;
    }

    await this.certificateTypeEventQueue.add(CertificateTypeEventJobs.CERTIFICATE_TYPE_CREATED, eventData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });
    this.logger.log(`Certificate type created job for: ${eventData.certificateTypeId}`);
  }

  async addCertificateTypeUpdatedEvent(eventData: CertificateTypeUpdatedEventJob): Promise<void> {
    const jobId = `${CertificateTypeJobPrefix.CERTIFICATE_TYPE_UPDATED}-${eventData.transactionHash}`;
    const existingJob = await this.certificateTypeEventQueue.getJob(jobId);
    if (existingJob) {
      this.logger.warn(`Certificate type updated job ${jobId} already exists. Skipped`);
      return;
    }

    await this.certificateTypeEventQueue.add(CertificateTypeEventJobs.CERTIFICATE_TYPE_UPDATED, eventData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });
    this.logger.log(`Certificate type updated job for: ${eventData.certificateTypeId}`);
  }

  async addCertificateTypeDeactivatedEvent(eventData: CertificateTypeDeactivatedEventJob): Promise<void> {
    const jobId = `${CertificateTypeJobPrefix.CERTIFICATE_TYPE_DEACTIVATED}-${eventData.transactionHash}`;
    const existingJob = await this.certificateTypeEventQueue.getJob(jobId);
    if (existingJob) {
      this.logger.warn(`Certificate type deactivated job ${jobId} already exists. Skipped`);
      return;
    }
    await this.certificateTypeEventQueue.add(CertificateTypeEventJobs.CERTIFICATE_TYPE_DEACTIVATED, eventData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });
    this.logger.log(`Certificate type deactivated job for: ${eventData.certificateTypeId}`);
  }
}