import { AuthModule } from '@modules/auth/auth.module';
import { QueueModule } from '@modules/queue/queue.module';
import { SharedModule } from '@modules/shared/shared.module';
import { User } from '@modules/user/entities';
import { forwardRef, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEventLoader } from './providers';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    QueueModule,
    SharedModule,
    DiscoveryModule
  ],
  controllers: [],
  providers: [
    ContractEventLoader,
  ],
  exports: [
  ],
})
export class WebThreeModule { }
