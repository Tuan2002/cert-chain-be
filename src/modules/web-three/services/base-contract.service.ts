import { EthersService } from '@base/modules/ethers/services';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Contract, InterfaceAbi, Provider, Wallet } from 'ethers';
import { ContractAddress, ContractInstance } from '../decorators';
import { HealthCheckTime } from '../enums';
import { ContractEventLoader } from '../providers';

@Injectable()
export abstract class BaseContractService {
  protected readonly logger: Logger;
  protected etherProvider: Provider;
  protected healthCheckInterval: NodeJS.Timeout | null = null;
  protected isHealthy: boolean = false;

  @ContractAddress()
  protected contractAddress: string;
  @ContractInstance()
  protected smartContract: Contract;

  constructor(
    protected readonly ethersService: EthersService,
    protected readonly configService: ConfigService,
    protected readonly contractName: string,
    protected readonly contractConfigKey: string,
    protected readonly contractAbi: InterfaceAbi,
    @Inject(ContractEventLoader)
    protected readonly contractEventLoader?: ContractEventLoader,
  ) {
    this.logger = new Logger(contractName);
    this.contractAddress =
      this.configService.getOrThrow<string>(contractConfigKey);
    this.createContractConnection();
  }

  /**
   * Creates a signed contract instance with the owner wallet
   * @param contractAbi - The contract ABI to use
   * @signedWallet - The wallet to sign transactions
   * @returns A signed contract instance
   */
  protected async createSignedContract(
    contractAbi: InterfaceAbi,
    signedWallet: Wallet,
  ): Promise<Contract> {
    return new Contract(this.contractAddress, contractAbi, signedWallet);
  }

  /**
   * Creates a wallet instance with the specified private key
   * @param privateKeyName - The configuration key for the private key
   * @returns A wallet instance
   */
  protected async createWallet(privateKeyName: string): Promise<Wallet> {
    const privateKey = this.configService.getOrThrow<string>(privateKeyName);
    return new Wallet(privateKey, this.etherProvider);
  }

  /**
   * Executes a contract method with error handling
   * @param contractMethod - The contract method to execute
   * @param _options - Optional parameters for error handling
   * @returns The result of the contract method
   */
  protected async executeContractMethod<T>(
    contractMethod: Promise<T>,
    _options?: {
      errorMessage?: string;
      callback?: (error: Error) => void;
    },
  ): Promise<T> {
    return contractMethod.catch((error) => {
      const errorMessage =
        _options?.errorMessage ||
        `Failed to execute contract method on ${this.contractName}`;
      this.logger.error(`${errorMessage}: `, error);
      if (_options?.callback) {
        _options.callback(error);
      }
      throw new InternalServerErrorException({
        message: errorMessage,
      });
    });
  }

  /**
   * Creates the contract connection and initializes health checks
   */
  protected createContractConnection(): void {
    this.etherProvider = this.ethersService.getProvider();
    this.smartContract = new Contract(
      this.contractAddress,
      this.contractAbi,
      this.etherProvider,
    );
    this.isHealthy = true;
    this.logger.log(
      `${this.contractName} contract connected at address: ${this.contractAddress}`,
    );
    this.startHealthCheck();
  }

  /**
   * Starts the health check interval
   */
  protected startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.etherProvider.getBlockNumber().catch((error) => {
        this.logger.warn('Contract connection health check failed:', error);
        this.isHealthy = false;
        this.handleReconnectContract();
      });
    }, HealthCheckTime.HEALTH_CHECK_INTERVAL);
  }

  /**
   * Handles contract reconnection
   */
  protected handleReconnectContract(): void {
    this.logger.warn(
      `Reconnecting to ${this.contractName} contract at: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    );
    this.clearHealthCheck();
    setTimeout(async () => {
      this.createContractConnection();
      // Retrigger event listeners after contract is recreated
      if (this.contractEventLoader) {
        await this.contractEventLoader.resubscribeEventListenersForContract(
          this.contractAddress,
        );
      }
    }, HealthCheckTime.HEALTH_CHECK_TIMEOUT);
  }

  /**
   * Clears the health check interval
   */
  protected clearHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}
