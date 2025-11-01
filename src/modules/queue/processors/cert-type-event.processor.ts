import { CertificateTypeTrackerService } from "@/modules/certificate/services";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CertificateTypeEventJobs, QueueNames } from "../enums";
import { CertificateTypeCreatedEventJob } from "../interfaces";

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
        await this.handleCertificateTypeCreatedJob(job.data);
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
}