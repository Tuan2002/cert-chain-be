import { ContractEventLog } from './webhook-event.type';

export type ContractEventType = {
  eventData: Array<unknown>;
  _eventLog: ContractEventLog;
};
