import { SecretManagerService } from '@/base/modules/secret/services';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  RawBodyRequest,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { sha256 } from 'js-sha256';
import { ALCHEMY_KEY } from '../constants';
import { AlchemySignKey } from '../enums';

@Injectable()
export class AlchemyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly secretManagerService: SecretManagerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RawBodyRequest<Request> = context
      .switchToHttp()
      .getRequest();

    const requestSignature = request.headers['x-alchemy-signature'];
    if (!requestSignature) {
      throw new BadRequestException('Missing Alchemy signature header');
    }

    const signKeyName =
      this.reflector.get<AlchemySignKey>(ALCHEMY_KEY, context.getHandler()) ||
      this.reflector.get<AlchemySignKey>(ALCHEMY_KEY, context.getClass());
    if (!signKeyName) {
      throw new BadRequestException(
        'No Alchemy key name to verify request signature',
      );
    }

    const signingKey =
      process.env[signKeyName] ??
      (await this.secretManagerService.getValueOrThrowAsync(signKeyName));
    const rawRequestBody = request?.rawBody;

    const hmac = sha256.hmac.create(signingKey);
    const signature = hmac.update(rawRequestBody).hex();
    if (signature !== requestSignature) {
      throw new UnauthorizedException('Invalid Alchemy signature');
    }

    return true;
  }
}
