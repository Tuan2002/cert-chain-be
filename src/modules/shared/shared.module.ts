import { RedisCacheModule } from '@base/modules/cache/redis-cache.module';
import { EthersModule } from '@base/modules/ethers/ethers.module';
import { ThirdPartyModule } from '@modules/third-party/third-party.module';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  imports: [RedisCacheModule, ThirdPartyModule, EthersModule],
  controllers: [],
  providers: [],
  exports: [RedisCacheModule, ThirdPartyModule, EthersModule],
})
export class SharedModule {}
