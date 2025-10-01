import { TransactionReceipt } from 'ethers';

export type RawWebhookEvent = {
  id: string;
  type: string;
  event: WebhookEventData;
  createdAt: Date;
};

export type WebhookEventData = {
  data: WebhookContractData;
  sequenceNumber: number;
  network: string;
};

export type WebhookContractData = {
  block: {
    hash: string;
    number: string;
    timestamp: string;
    parentHash: string;
    logs: Array<ContractEventLog>;
  };
};

export type ContractEventLog = {
  data: string;
  topics: ReadonlyArray<string>;
  index: number;
  transaction: TransactionReceipt;
};
