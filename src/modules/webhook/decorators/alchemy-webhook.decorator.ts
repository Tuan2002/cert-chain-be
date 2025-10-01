import { applyDecorators, UseGuards } from '@nestjs/common';
import { AlchemySignKey } from '../enums';
import { AlchemyKey } from './alchemy-key.decorator';
import { AlchemyGuard } from '../guards';
import { ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

export function AlchemyWebhookAuth(keyName: AlchemySignKey) {
  return applyDecorators(
    AlchemyKey(keyName),
    UseGuards(AlchemyGuard),
    ApiUnauthorizedResponse({ description: '401 - Unauthorized' }),
    ApiForbiddenResponse({ description: '403 - Forbidden' }),
  );
}
