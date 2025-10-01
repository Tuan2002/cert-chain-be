// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AlchemySignKey } from '../enums';
import { ALCHEMY_KEY } from '../constants';

export const AlchemyKey = (keyName: AlchemySignKey) =>
  SetMetadata(ALCHEMY_KEY, keyName);
