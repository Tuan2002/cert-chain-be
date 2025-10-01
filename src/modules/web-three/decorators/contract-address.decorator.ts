import 'reflect-metadata';

export const CONTRACT_ADDRESS = 'CONTRACT_ADDRESS';
export const CONTRACT_INSTANCE = 'CONTRACT_INSTANCE';

/**
 * Decorator to mark a property as the contract address.
 * The ContractEventLoaderService will use this to identify the contract address.
 */
export const ContractAddress = () => (target: object, propertyKey: string) => {
  Reflect.defineMetadata(CONTRACT_ADDRESS, true, target, propertyKey);
};

/**
 * Decorator to mark a property as the contract instance.
 * The ContractEventLoaderService will use this to get the contract for event listening.
 */
export const ContractInstance = () => (target: object, propertyKey: string) => {
  Reflect.defineMetadata(CONTRACT_INSTANCE, true, target, propertyKey);
};
