import { CertificateTypeTrackerService } from "@/modules/certificate/services";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CertificateTypeEventJobs, QueueNames } from "../enums";
import { CertificateTypeCreatedEventJob, CertificateTypeDeactivatedEventJob, CertificateTypeUpdatedEventJob } from "../interfaces";

@Processor(QueueNames.CERTIFICATE_TYPE_EVENTS)
export class CertificateTypeEventProcessor extends WorkerHost {
  private readonly logger = new Logger(CertificateTypeEventProcessor.name);

  constructor(
    private readonly certTypeTrackerService: CertificateTypeTrackerService
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case CertificateTypeEventJobs.CERTIFICATE_TYPE_CREATED:
        return this.handleCertificateTypeCreatedJob(job.data);

      case CertificateTypeEventJobs.CERTIFICATE_TYPE_UPDATED:
        return this.handleCertificateTypeUpdatedJob(job.data);

      case CertificateTypeEventJobs.CERTIFICATE_TYPE_DEACTIVATED:
        return this.handleCertificateTypeDeactivatedJob(job.data);
    }
  }

  async handleCertificateTypeCreatedJob(eventData: CertificateTypeCreatedEventJob): Promise<void> {
    const {
      certificateTypeId,
      code,
      name,
      transactionHash
    } = eventData;
    this.logger.log(`Processing certificate type created event for ID: ${certificateTypeId}`);

    await this.certTypeTrackerService.handleCertificateTypeAddedEvent({
      certificateTypeId,
      transactionHash,
      name,
      code,
    });

    this.logger.log(`Processed certificate type created event for ID: ${certificateTypeId}`);
  }

  async handleCertificateTypeUpdatedJob(eventData: CertificateTypeUpdatedEventJob): Promise<void> {
    const {
      certificateTypeId,
      code,
      name,
      description,
      transactionHash
    } = eventData;
    this.logger.log(`Processing certificate type updated event for ID: ${certificateTypeId}`);

    await this.certTypeTrackerService.handleCertificateTypeUpdatedEvent({
      certificateTypeId,
      name,
      code,
      description,
      transactionHash,
    });

    this.logger.log(`Processed certificate type updated event for ID: ${certificateTypeId}`);
  }

  async handleCertificateTypeDeactivatedJob(eventData: CertificateTypeDeactivatedEventJob): Promise<void> {
    const {
      certificateTypeId,
      transactionHash
    } = eventData;
    this.logger.log(`Processing certificate type deactivated event for ID: ${certificateTypeId}`);

    await this.certTypeTrackerService.handleCertificateTypeDeactivatedEvent({
      certificateTypeId,
      transactionHash,
    });

    this.logger.log(`Processed certificate type deactivated event for ID: ${certificateTypeId}`);
  }
}