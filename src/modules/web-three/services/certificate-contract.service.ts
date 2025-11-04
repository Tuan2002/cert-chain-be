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
    await this.certificateEventQueueService.addCertificateSignedEvent({
      certificateId,
      organizationId,
      certificateTypeId,
      subnmitterAddress: submitterAddress,
      authorIdCard: autholderIdCard,
      transactionHash: _event.log.transactionHash,
    });
  }
}
