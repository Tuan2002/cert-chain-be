import {
  EthersRPCConnectionType,
  WebSocketEvent,
  WebSocketTimeout,
} from '@base/enums';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonRpcProvider, Provider, WebSocketProvider } from 'ethers';
import WebSocket from 'ws';

@Injectable()
export class EthersService {
  private logger: Logger;
  private rpcConnectionType: EthersRPCConnectionType;
  private rpcUrl: string;
  private rpcWssUrl: string;
  private rpcApiKey: string;
  private ethersProvider: Provider;
  private webSocketConnection: WebSocket;
  private pingInterval: NodeJS.Timeout;
  private pongTimeout: NodeJS.Timeout;
  private isConnected: boolean = false;

  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(EthersService.name);
    this.rpcConnectionType =
      this.configService.get<EthersRPCConnectionType>(
        'ETHEREUM_RPC_CONNECTION_TYPE',
      ) || EthersRPCConnectionType.HTTP;
    this.rpcUrl = this.configService.getOrThrow<string>('ETHEREUM_RPC_URL');
    this.rpcWssUrl = this.configService.getOrThrow<string>(
      'ETHEREUM_RPC_WSS_URL',
    );
    this.rpcApiKey = this.configService.getOrThrow<string>(
      'ETHEREUM_RPC_API_KEY',
    );
    this.logger.log(`Config RPC connection type: ${this.rpcConnectionType}`);
    this.initializeProvider();
  }

  public getProvider = (): Provider => {
    if (!this.ethersProvider) {
      throw new Error('Ethers provider is not initialized');
    }
    return this.ethersProvider;
  };

  private initializeProvider = (): void => {
    switch (this.rpcConnectionType) {
      case EthersRPCConnectionType.HTTP:
        this.ethersProvider = new JsonRpcProvider(
          `${this.rpcUrl}/${this.rpcApiKey}`,
        );
        break;
      case EthersRPCConnectionType.WEB_SOCKET:
        this.createWebSocketConnection();
        break;
      default:
        throw new InternalServerErrorException(
          `Unsupported RPC connection type: ${this.rpcConnectionType}`,
        );
    }
  };

  private createWebSocketConnection = () => {
    this.webSocketConnection = new WebSocket(
      `${this.rpcWssUrl}/${this.rpcApiKey}`,
    );
    this.ethersProvider = new WebSocketProvider(this.webSocketConnection);
    this.webSocketConnection.on(
      WebSocketEvent.OPEN,
      this.onSocketConnectionOpen,
    );
    this.webSocketConnection.on(
      WebSocketEvent.CLOSE,
      this.onSocketConnectionClose,
    );
    this.webSocketConnection.on(
      WebSocketEvent.ERROR,
      this.onSocketConnectionError,
    );
    this.webSocketConnection.on(WebSocketEvent.PONG, this.onSocketPong);
  };

  private reconnectWebSocket = () => {
    this.clearHeartbeat();
    this.ethersProvider.destroy();
    setTimeout(() => {
      this.logger.warn('Reconnecting to RPC WebSocket...');
      if (this.webSocketConnection) {
        this.webSocketConnection.removeAllListeners();
      }
      this.createWebSocketConnection();
    }, WebSocketTimeout.ETHEREUM_RPC);
  };

  private onSocketConnectionOpen = () => {
    this.logger.log('RPC WebSocket connection established');
    this.isConnected = true;
    this.startHeartbeat();
  };

  private onSocketConnectionClose = () => {
    this.logger.warn('RPC WebSocket connection has been closed');
    this.isConnected = false;
    this.reconnectWebSocket();
  };

  private onSocketConnectionError = (error: Error) => {
    this.logger.error('RPC WebSocket connection ERROR: ', error.message);
    this.isConnected = false;
    this.clearHeartbeat();
  };

  private onSocketPong = () => {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  };

  private startHeartbeat = () => {
    this.pingInterval = setInterval(() => {
      if (this.webSocketConnection && this.isConnected) {
        this.webSocketConnection.ping();
        this.pongTimeout = setTimeout(() => {
          this.logger.warn(
            'PONG timeout - WebSocket connection is disconnected',
          );
          this.isConnected = false;
          this.webSocketConnection.terminate();
        }, WebSocketTimeout.PONG);
      }
    }, WebSocketTimeout.PING);
  };

  private clearHeartbeat = () => {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  };
}
