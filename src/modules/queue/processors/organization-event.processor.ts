import { OrganizationTrackerService } from "@/modules/organization/services";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { OrganizationEventJobs, QueueNames } from "../enums";
import { OrganizationAddedEventJob } from "../interfaces";

@Processor(QueueNames.ORGANIZATION_EVENTS)
export class OrganizationEventProcessor extends WorkerHost {
  private readonly logger = new Logger(OrganizationEventProcessor.name);

  constructor(
    private readonly organizationTrackerService: OrganizationTrackerService
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case OrganizationEventJobs.ORGANIZATION_ADDED:
        return this.handleOrganizationAddedEventQueue(job.data);
    }
  }

  private async handleOrganizationAddedEventQueue(
    data: OrganizationAddedEventJob
  ): Promise<void> {
    this.logger.log(`Processing organization added event for organization ID: ${data.organizationId}`);

    await this.organizationTrackerService.handleOrganizationAddedEvent({
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      ownerAddress: data.ownerAddress,
      countryCode: data.countryCode,
      transactionHash: data.transactionHash,
    });

    this.logger.log(`Processed organization added event for organization ID: ${data.organizationId}`);
  }
}