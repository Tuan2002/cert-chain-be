import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Contract } from 'ethers';
import {
  CONTRACT_ADDRESS,
  CONTRACT_EVENT_LISTENER,
  CONTRACT_INSTANCE,
  ContractEventConfig,
  SMART_CONTRACT_SERVICE,
} from '../decorators';

interface EventListenerMetadata extends ContractEventConfig {
  methodName: string;
  target: string;
  instance: object;
  callback: (...args: unknown[]) => void;
  paramNames?: string[];
}

@Injectable()
export class ContractEventLoader implements OnModuleInit {
  private readonly logger = new Logger(ContractEventLoader.name);
  private eventListeners: EventListenerMetadata[] = [];
  private activeListeners: Map<string, () => void> = new Map();
  private contractServices: Map<string, object> = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    await this.discoverContractServices();
    await this.discoverEventListeners();
    await this.setupEventListeners();
  }

  /**
   * Discover all contract services and their event listeners
   */
  private async discoverContractServices(): Promise<void> {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;

      const isContractService = this.reflector.get<boolean>(
        SMART_CONTRACT_SERVICE,
        metatype,
      );
      if (isContractService) {
        const contractAddress = this.getServiceContractAddress(instance);
        if (contractAddress) {
          this.contractServices.set(contractAddress, instance);
        }
      }
    });
  }

  /**
   * Get contract address from service using decorators or methods
   */
  private getServiceContractAddress(
    instance: Record<string, unknown>,
  ): string | null {
    // Check instance properties for decorated contract address
    for (const propertyName of Object.keys(instance)) {
      const isContractAddress = Reflect.getMetadata(
        CONTRACT_ADDRESS,
        instance.constructor.prototype,
        propertyName,
      );
      if (isContractAddress && typeof instance[propertyName] === 'string') {
        return instance[propertyName] as string;
      }
    }

    // Check instance properties for any string that looks like an address
    for (const propertyName of Object.keys(instance)) {
      const value = instance[propertyName];
      if (
        typeof value === 'string' &&
        value.startsWith('0x') &&
        value.length === 42
      ) {
        return value;
      }
    }

    // Fallback to method if available
    if (typeof instance.getContractAddress === 'function') {
      const address = (instance.getContractAddress as () => string)();
      return address;
    }
    return null;
  }

  /**
   * Get contract instance from service using decorators or methods
   */
  private getServicesContractInstance(
    instance: Record<string, unknown>,
  ): Contract | null {
    // Check instance properties for decorated contract instance
    for (const propertyName of Object.keys(instance)) {
      const isContractInstance = Reflect.getMetadata(
        CONTRACT_INSTANCE,
        instance.constructor.prototype,
        propertyName,
      );
      if (isContractInstance) {
        const value = instance[propertyName];
        if (value && typeof value === 'object') {
          // Check if it looks like a Contract - ethers Contract has 'target' property
          if ('target' in value || 'address' in value || 'interface' in value) {
            return value as unknown as Contract;
          }
        }
      }
    }

    // Check instance properties for contract instance
    for (const propertyName of Object.keys(instance)) {
      const value = instance[propertyName];
      if (
        value &&
        typeof value === 'object' &&
        ('target' in value || ('address' in value && 'interface' in value))
      ) {
        return value as unknown as Contract;
      }
    }

    // Fallback to method if available
    if (typeof instance.getContract === 'function') {
      const contract = (instance.getContract as () => Contract)();
      return contract;
    }

    return null;
  }

  /**
   * Discover all event listeners in the application
   * This will scan all providers and their methods for the CONTRACT_EVENT_LISTENER metadata
   */
  private async discoverEventListeners(): Promise<void> {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) return;

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (name) => name,
      );

      methodNames.forEach((methodName) => {
        const eventConfig = this.reflector.get<
          ContractEventConfig & { methodName: string; paramNames?: string[] }
        >(CONTRACT_EVENT_LISTENER, instance[methodName]);

        if (eventConfig) {
          const target = instance.constructor.name;
          const contractAddress =
            eventConfig.contractAddress ||
            this.getServiceContractAddress(instance as Record<string, unknown>);
          this.eventListeners.push({
            ...eventConfig,
            contractAddress,
            target,
            instance,
            callback: instance[methodName].bind(instance),
            paramNames: eventConfig.paramNames,
          });
        }
      });
    });
  }

  /**
   * Set up event listeners for all discovered events
   * This will subscribe to the events using the contract instances
   */
  private async setupEventListeners(): Promise<void> {
    await Promise.allSettled(
      this.eventListeners.map((listener) => this.subscribeToEvent(listener)),
    );
  }

  /**
   * Subscribe to a specific event using the contract instance
   * This will set up the event listener and store it for potential cleanup later
   */
  private async subscribeToEvent(
    listener: EventListenerMetadata,
  ): Promise<void> {
    const contract = this.getContract(listener.contractAddress);
    if (!contract) {
      this.logger.error(
        `Contract not found for event listener: ${listener.eventName}`,
      );
      return;
    }

    const listenerKey = `${listener.target}.${listener.methodName}`;
    const eventCallback = this.createEventCallback(listener);
    contract.on(listener.eventName, eventCallback).catch((error) => {
      this.logger.error(
        `Failed to subscribe event "${listener.eventName}" on contract "${listener.contractAddress}": ${error.message}`,
      );
      return;
    });
    this.registerActiveListener(
      listenerKey,
      contract,
      listener.eventName,
      eventCallback,
    );

    this.logger.log(
      `Subscribed to "${listener.eventName}" event for ${listenerKey}`,
    );
  }

  /**
   * Create an event callback function that maps event parameters to method parameters
   */
  private createEventCallback(
    listener: EventListenerMetadata,
  ): (...args: unknown[]) => void {
    return (...args: unknown[]) => {
      const eventParams = this.extractEventParameters(args);
      const mappedArgs = this.mapEventParametersToMethodParameters(
        listener,
        eventParams,
        args,
      );

      listener.callback(...mappedArgs);
    };
  }

  /**
   * Extract event parameters from ethers.js event arguments
   * The last argument is always the event object, the rest are event parameters
   */
  private extractEventParameters(args: unknown[]): unknown[] {
    return args.slice(0, -1);
  }

  /**
   * Map event parameters to method parameters based on the method signature
   */
  private mapEventParametersToMethodParameters(
    listener: EventListenerMetadata,
    eventParams: unknown[],
    allArgs: unknown[],
  ): unknown[] {
    if (!listener.paramNames || listener.paramNames.length === 0) {
      // Fallback: use all arguments for backward compatibility
      return allArgs;
    }

    const mappedArgs: unknown[] = [];
    for (let i = 0; i < listener.paramNames.length; i++) {
      if (i < eventParams.length) {
        mappedArgs.push(eventParams[i]);
      } else {
        mappedArgs.push(undefined);
      }
    }

    return mappedArgs;
  }

  /**
   * Register an active listener for cleanup management
   */
  private registerActiveListener(
    listenerKey: string,
    contract: Contract,
    eventName: string,
    eventCallback: (...args: unknown[]) => void,
  ): void {
    const cleanup = () => contract.off(eventName, eventCallback);
    this.activeListeners.set(listenerKey, cleanup);
  }

  /**
   * Get the contract instance for a specific address or the first available contract
   * If no address is provided, it will return the first contract found
   */
  private getContract(contractAddress?: string): Contract | null {
    if (!contractAddress) {
      // If no specific address is provided, try to get the first available contract
      const firstContractService = this.contractServices.values().next().value;
      return (
        this.getServicesContractInstance(
          firstContractService as Record<string, unknown>,
        ) || null
      );
    }

    // Find the contract service that manages the specified address
    const contractService = this.contractServices.get(contractAddress);
    return (
      this.getServicesContractInstance(
        contractService as Record<string, unknown>,
      ) || null
    );
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribeFromEvent(listenerKey: string): boolean {
    const cleanup = this.activeListeners.get(listenerKey);

    if (cleanup) {
      cleanup();
      this.activeListeners.delete(listenerKey);
      return true;
    }

    return false;
  }

  /**
   * Unsubscribe from all events
   */
  unsubscribeFromAllEvents(): void {
    this.activeListeners.forEach((cleanup) => {
      cleanup();
    });
    this.activeListeners.clear();
  }

  /**
   * Get information about active listeners
   */
  getActiveListeners(): string[] {
    return Array.from(this.activeListeners.keys());
  }

  /**
   * Get discovered event listeners information
   */
  getDiscoveredListeners(): Array<{
    eventName: string;
    target: string;
    methodName: string;
    contractAddress?: string;
  }> {
    return this.eventListeners.map((listener) => ({
      eventName: listener.eventName,
      target: listener.target,
      methodName: listener.methodName,
      contractAddress: listener.contractAddress,
    }));
  }

  /**
   * Get information about discovered contract services
   */
  getDiscoveredContractServices(): Array<{
    contractAddress: string;
    serviceName: string;
  }> {
    return Array.from(this.contractServices.entries()).map(
      ([address, service]) => ({
        contractAddress: address,
        serviceName: service.constructor.name,
      }),
    );
  }

  /**
   * Resubscribe event listeners for a specific contract address
   * This is useful when a contract connection is recreated
   */
  async resubscribeEventListenersForContract(
    contractAddress: string,
  ): Promise<void> {
    this.logger.log(
      `Resubscribing event listeners for contract: ${contractAddress}`,
    );

    // Get all listeners for this contract
    const contractListeners = this.eventListeners.filter(
      (listener) =>
        listener.contractAddress === contractAddress ||
        (!listener.contractAddress &&
          this.getServiceContractAddress(
            listener.instance as Record<string, unknown>,
          ) === contractAddress),
    );

    if (contractListeners.length === 0) {
      this.logger.warn(
        `No event listeners found for contract: ${contractAddress}`,
      );
      return;
    }

    // Unsubscribe existing listeners for this contract
    const activeListenerKeys = Array.from(this.activeListeners.keys());
    for (const listenerKey of activeListenerKeys) {
      const [target, methodName] = listenerKey.split('.');
      const listener = contractListeners.find(
        (l) => l.target === target && l.methodName === methodName,
      );
      if (listener) {
        this.unsubscribeFromEvent(listenerKey);
      }
    }

    // Resubscribe all listeners for this contract
    await Promise.all(
      contractListeners.map(async (listener) => {
        await this.subscribeToEvent(listener);
      }),
    );
  }

  /**
   * Resubscribe all event listeners for all contracts
   * This is useful for debugging or manual intervention
   */
  async resubscribeAllEventListeners(): Promise<void> {
    // Unsubscribe all existing listeners
    this.unsubscribeFromAllEvents();
    // Resubscribe all listeners
    await this.setupEventListeners();
  }
}
