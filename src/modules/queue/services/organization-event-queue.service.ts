import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { DEFAULT_JOB_OPTIONS } from "../configs";
import { OrganizationEventJobs, OrganizationJobPrefix, QueueNames } from "../enums";
import { OrganizationAddedEventJob } from "../interfaces";

@Injectable()
export class OrganizationEventQueueService {
  private readonly logger = new Logger(OrganizationEventQueueService.name);

  constructor(
    @InjectQueue(QueueNames.ORGANIZATION_EVENTS)
    private readonly organizationEventQueue: Queue,
  ) { }

  async addOrganizationAddedEvent(eventData: OrganizationAddedEventJob): Promise<void> {
    const jobId = `${OrganizationJobPrefix.ORGANIZATION_ADDED}-${eventData.transactionHash}`;
    const existingJob = await this.organizationEventQueue.getJob(jobId);
    if (existingJob) {
      this.logger.warn(`Organization added job ${jobId} already exists. Skipped`);
      return;
    }

    await this.organizationEventQueue.add(OrganizationEventJobs.ORGANIZATION_ADDED, eventData, {
      ...DEFAULT_JOB_OPTIONS,
      jobId,
    });
    this.logger.log(`Organization added job for: ${eventData.organizationId}`);
  }
}