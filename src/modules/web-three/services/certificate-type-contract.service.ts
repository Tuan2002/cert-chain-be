import { CertificateTypeEventQueueService } from '@/modules/queue/services';
import { EthersService } from '@base/modules/ethers/services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContractEventPayload } from 'ethers';
import slug from 'slug';
import { CERTIFICATE_TYPE_CONTRACT_ABI, CONTRACT_CHARACTERS } from '../constants';
import { OnContractEvent, SmartContractService } from '../decorators';
import {
  CertificateTypeContractEvent,
  ContractConfigKey
} from '../enums';
import { ContractEventLoader } from '../providers';
import { CreateCertificateType, UpdateCertificateType } from '../types';
import { BaseContractService } from './base-contract.service';

@Injectable()
@SmartContractService()
export class CertificateTypeContractService extends BaseContractService {

  constructor(
    ethersService: EthersService,
    configService: ConfigService,
    contractEventLoader: ContractEventLoader,
    private readonly certTypeEventQueueService: CertificateTypeEventQueueService
  ) {
    super(
      ethersService,
      configService,
      CertificateTypeContractService.name,
      ContractConfigKey.CERTIFICATE_TYPE_ADDRESS,
      CERTIFICATE_TYPE_CONTRACT_ABI,
      contractEventLoader,
    );
  }

  @OnContractEvent(CertificateTypeContractEvent.CertificateTypeCreated)
  async handleOrganizationCreated(
    certificateTypeId: string,
    name: string,
    code: string,
    _event: ContractEventPayload,
  ) {
    this.logger.log(`Certificate type created - ID: ${certificateTypeId}, Name: ${name}`);
    await this.certTypeEventQueueService.addOrganizationAddedEvent({
      certificateTypeId,
      name,
      code,
      transactionHash: _event.log.transactionHash,
    });
  }

  @OnContractEvent(CertificateTypeContractEvent.CertificateTypeUpdated)
  async handleCertificateTypeUpdated(
    certificateTypeId: string,
    name: string,
    code: string,
    description: string,
    _event: ContractEventPayload,
  ) {
    this.logger.log(`Certificate type updated - ID: ${certificateTypeId}, Name: ${name}`);
    await this.certTypeEventQueueService.addCertificateTypeUpdatedEvent({
      certificateTypeId,
      name,
      code,
      description,
      transactionHash: _event.log.transactionHash,
    });
  }

  @OnContractEvent(CertificateTypeContractEvent.CertificateTypeDeactivated)
  async handleCertificateTypeDeactivated(
    certificateTypeId: string,
    _event: ContractEventPayload,
  ) {
    this.logger.log(`Certificate type deactivated - ID: ${certificateTypeId}`);
    await this.certTypeEventQueueService.addCertificateTypeDeactivatedEvent({
      certificateTypeId,
      transactionHash: _event.log.transactionHash,
    });
  }

  async createCertificateTypeAsync(certificateTypeData: CreateCertificateType): Promise<void> {
    const { id, code, name } = certificateTypeData;
    const certificateTypeName = slug(name, {
      replacement: CONTRACT_CHARACTERS.NAME_SLUG_SEPARATOR,
      lower: false,
    });
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_TYPE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.createCertificateType(
        id,
        certificateTypeName,
        code,
        CONTRACT_CHARACTERS.EMPTY_FIELD_REPLACEMENT
      ),
      {
        errorMessage: 'Failed to create certificate type on blockchain',
      },
    );
  }

  async updateCertificateTypeAsync(certificateTypeData: UpdateCertificateType): Promise<void> {
    const { id, code, name } = certificateTypeData;
    const certificateTypeName = slug(name, {
      replacement: CONTRACT_CHARACTERS.NAME_SLUG_SEPARATOR,
      lower: false,
    });
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_TYPE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.updateCertificateType(
        id,
        certificateTypeName,
        code,
        CONTRACT_CHARACTERS.EMPTY_FIELD_REPLACEMENT
      ),
      {
        errorMessage: 'Failed to update certificate type on blockchain',
      },
    );
  }

  async reactivateCertificateTypeAsync(certificateTypeId: string): Promise<void> {
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_TYPE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.reactivateCertificateType(
        certificateTypeId,
      ),
      {
        errorMessage: 'Failed to reactivate certificate type on blockchain',
      },
    );
  }

  async deactivateCertificateTypeAsync(certificateTypeId: string): Promise<void> {
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_TYPE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.deactivateCertificateType(
        certificateTypeId,
      ),
      {
        errorMessage: 'Failed to deactivate certificate type on blockchain',
      },
    );
  }
}