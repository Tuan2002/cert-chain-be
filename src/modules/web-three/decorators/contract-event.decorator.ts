import { SetMetadata } from '@nestjs/common';

export const CONTRACT_EVENT_LISTENER = 'CONTRACT_EVENT_LISTENER';

export interface ContractEventConfig {
  eventName: string;
  contractAddress?: string;
  filter?: Record<string, unknown>;
  fromBlock?: number | 'latest';
}

/**
 * Decorator to mark a method as a contract event listener
 * This decorator should be used in services that extend a base contract service
 *
 * @param config Configuration for the event listener
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @ContractEventListener({
 *   eventName: 'LotteryCreated',
 *   filter: { roundId: 123 }
 * })
 * handleLotteryCreated(roundId: number, startTime: number, endTime: number, event: any) {
 *   // Handle the event
 * }
 * ```
 */
export function ContractEventListener(config: ContractEventConfig) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    SetMetadata(CONTRACT_EVENT_LISTENER, {
      ...config,
      methodName: propertyKey,
    })(target, propertyKey, descriptor);

    return descriptor;
  };
}

/**
 * Simplified decorator for listening to contract events with just event name
 * @param eventName Name of the contract event
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @OnContractEvent('TicketPurchased')
 * handleTicketPurchased(roundId: number, buyer: string, amount: number, event: any) {
 *   // Handle the event
 * }
 * ```
 */
export function OnContractEvent(eventName: string) {
  return ContractEventListener({ eventName });
}
