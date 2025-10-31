import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Organization, OrganizationMember } from "../entities";
import { OrganizationAddedEvent } from "../types";

@Injectable()
export class OrganizationTrackerService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async handleOrganizationAddedEvent(eventData: OrganizationAddedEvent): Promise<void> {
    const {
      organizationId,
      ownerAddress,
      transactionHash
    } = eventData;

    const pendingOrganization = await this.organizationRepository.exists({
      where: {
        id: organizationId,
        isActive: false,
      }
    })

    if (!pendingOrganization) {
      throw new Error(`Organization with ID ${organizationId} not found or already active`);
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      await manager.update(Organization, {
        id: organizationId
      }, {
        isActive: true,
        initTxHash: transactionHash,
      });

      await manager.update(OrganizationMember, {
        organizationId: organizationId,
        walletAddress: ownerAddress.toLowerCase(),
      }, {
        isActive: true,
        addedTxHash: transactionHash,
      })
    })
  }
}