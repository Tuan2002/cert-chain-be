import { OrganizationEventQueueService } from '@/modules/queue/services';
import { EthersService } from '@base/modules/ethers/services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContractEventPayload } from 'ethers';
import slug from 'slug';
import { CONTRACT_CHARACTERS, ORGANIZATION_CONTRACT_ABI } from '../constants';
import { OnContractEvent, SmartContractService } from '../decorators';
import {
  ContractConfigKey
} from '../enums';
import { OrganizationContractEvent } from '../enums/organization-contract-event.enum';
import { ContractEventLoader } from '../providers';
import { CreateOrganizationType } from '../types';
import { BaseContractService } from './base-contract.service';

@Injectable()
@SmartContractService()
export class OrganizationContractService extends BaseContractService {

  constructor(
    ethersService: EthersService,
    configService: ConfigService,
    contractEventLoader: ContractEventLoader,
    private readonly organizationEventQueueService: OrganizationEventQueueService,

  ) {
    super(
      ethersService,
      configService,
      OrganizationContractService.name,
      ContractConfigKey.ORGANIZATION_ADDRESS,
      ORGANIZATION_CONTRACT_ABI,
      contractEventLoader,
    );
  }

  @OnContractEvent(OrganizationContractEvent.OrganizationCreated)
  async handleOrganizationCreated(
    organizationId: string,
    ownerAddress: string,
    organizationName: string,
    countryCode: string,
    _event: ContractEventPayload,
  ) {
    this.logger.log(`Organization created - ID: ${organizationId}, Name: ${organizationName}`);
    await this.organizationEventQueueService.addOrganizationAddedEvent({
      organizationId,
      ownerAddress,
      organizationName,
      countryCode,
      transactionHash: _event.log.transactionHash,
    });
  }

  /**
   * Create organization on blockchain
   * @param organizationData 
   * @throws Error when transaction fails
   */
  async createOrganizationAsync(organizationData: CreateOrganizationType): Promise<void> {
    const { id, owner, name, countryCode } = organizationData;
    const organizationName = slug(name, {
      replacement: CONTRACT_CHARACTERS.NAME_SLUG_SEPARATOR,
      lower: false,
    });
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      ORGANIZATION_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.createOrganization(
        id,
        owner,
        organizationName,
        countryCode,
      ),
      {
        errorMessage: 'Failed to create organization on blockchain',
      },
    );
  }
}
