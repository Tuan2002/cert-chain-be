import { SetMetadata } from '@nestjs/common';
import { InterfaceAbi } from 'ethers';
import { WEBHOOK_CONTRACT_ABI } from '../constants';

export const WebhookContractABI = (contractAbi: InterfaceAbi) =>
  SetMetadata(WEBHOOK_CONTRACT_ABI, contractAbi);
