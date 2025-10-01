import { Module } from '@nestjs/common';
import { EthersService } from './services';

@Module({
  imports: [],
  controllers: [],
  providers: [EthersService],
  exports: [EthersService],
})
export class EthersModule {}
