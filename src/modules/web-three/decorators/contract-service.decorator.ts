import { SetMetadata } from '@nestjs/common';

export const SMART_CONTRACT_SERVICE = 'SMART_CONTRACT_SERVICE';

/**
 * Decorator to mark a service as a contract service.
 * This allows the ContractEventLoaderService to automatically discover
 * and use contract services for event subscription.
 */
export const SmartContractService = () =>
  SetMetadata(SMART_CONTRACT_SERVICE, true);
