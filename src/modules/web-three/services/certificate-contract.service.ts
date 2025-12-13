import { CertificateEventQueueService } from '@/modules/queue/services';
import { EthersService } from '@base/modules/ethers/services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContractEventPayload } from 'ethers';
import { CERTIFICATE_CONTRACT_ABI } from '../constants';
import { OnContractEvent, SmartContractService } from '../decorators';
import {
  ContractConfigKey
} from '../enums';
import { CertificateContractEvent } from '../enums/certificate-contract-event.enum';
import { ContractEventLoader } from '../providers';
import { BaseContractService } from './base-contract.service';

@Injectable()
@SmartContractService()
export class CertificateContractService extends BaseContractService {

  constructor(
    ethersService: EthersService,
    configService: ConfigService,
    contractEventLoader: ContractEventLoader,
    private readonly certificateEventQueueService: CertificateEventQueueService
  ) {
    super(
      ethersService,
      configService,
      CertificateContractService.name,
      ContractConfigKey.CERTIFICATE_ADDRESS,
      CERTIFICATE_CONTRACT_ABI,
      contractEventLoader,
    );
  }

  @OnContractEvent(CertificateContractEvent.CertificateSubmitted)
  async handleCertificateSigned(
    certificateId: string,
    organizationId: string,
    certificateTypeId: string,
    submitterAddress: string,
    autholderIdCard: string,
    _event: ContractEventPayload

  ) {
    this.logger.log(`Certificate signed - ID: ${certificateId}, Type ID: ${certificateTypeId}`);
    return this.certificateEventQueueService.addCertificateSignedEvent({
      certificateId,
      organizationId,
      certificateTypeId,
      subnmitterAddress: submitterAddress,
      authorIdCard: autholderIdCard,
      transactionHash: _event.log.transactionHash,
    });
  }

  @OnContractEvent(CertificateContractEvent.CertificateApproved)
  async handleCertificateApproved(
    certificateId: string,
    approvedBy: string,
    _event: ContractEventPayload
  ) {
    this.logger.log(`Certificate approved - ID: ${certificateId}`);
    return this.certificateEventQueueService.addCertificateApprovedEvent({
      certificateId,
      approverAddress: approvedBy,
      transactionHash: _event.log.transactionHash,
    });
  }

  @OnContractEvent(CertificateContractEvent.CertificateRevoked)
  async handleCertificateRevoked(
    certificateId: string,
    revokedBy: string,
    reason: string,
    _event: ContractEventPayload
  ) {
    this.logger.log(`Certificate revoked - ID: ${certificateId}`);
    return this.certificateEventQueueService.addCertificateRevokedEvent({
      certificateId,
      revokedBy,
      reason,
      transactionHash: _event.log.transactionHash,
    });
  }

  async approveCertificateAsync(certificateId: string): Promise<void> {
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.approveCertificate(
        certificateId
      ),
      {
        errorMessage: 'Failed to approve certificate on-chain',
      },
    );

  }

  async revokeCertificateAsync(certificateId: string, reason: string): Promise<void> {
    const signedWallet = await this.createWallet(
      ContractConfigKey.OWNER_WALLET_KEY,
    );
    const signedContract = await this.createSignedContract(
      CERTIFICATE_CONTRACT_ABI,
      signedWallet,
    );

    return this.executeContractMethod(
      signedContract.revokeCertificate(
        certificateId,
        reason
      ),
      {
        errorMessage: 'Failed to revoke certificate on-chain',
      },
    );
  }
}
