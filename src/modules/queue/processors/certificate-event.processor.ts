import { CertificateTrackerService } from "@/modules/certificate/services";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { CertificateEventJobs, QueueNames } from "../enums";
import { CertificateSignedEventJob } from "../interfaces";

@Processor(QueueNames.CERTIFICATE_TYPE_EVENTS)
export class CertificateEventProcessor extends WorkerHost {
  private readonly logger = new Logger(CertificateEventProcessor.name);

  constructor(
    private readonly certificateTrackerService: CertificateTrackerService
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case CertificateEventJobs.CERTIFICATE_SIGNED:
        return this.handleCertificateSignedJob(job.data);
    }
  }

  async handleCertificateSignedJob(eventData: CertificateSignedEventJob): Promise<void> {
    const {
      certificateTypeId,
      certificateId,
      organizationId,
      authorIdCard,
      subnmitterAddress,
      transactionHash
    } = eventData;
    this.logger.log(`Processing certificate signed event for ID: ${certificateId}`);

    await this.certificateTrackerService.handleCertificateSignedEvent({
      certificateTypeId,
      certificateId,
      organizationId,
      authorIdCard,
      subnmitterAddress,
      transactionHash
    });

    this.logger.log(`Processed certificate signed event for ID: ${certificateId}`);
  }
}