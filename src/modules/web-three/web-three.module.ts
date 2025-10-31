import { AuthModule } from '@modules/auth/auth.module';
import { QueueModule } from '@modules/queue/queue.module';
import { SharedModule } from '@modules/shared/shared.module';
import { User } from '@modules/user/entities';
import { forwardRef, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEventLoader } from './providers';
import { OrganizationContractService } from './services';

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
    OrganizationContractService,
    ContractEventLoader
  ],
  exports: [
    OrganizationContractService
  ],
})
export class WebThreeModule { }
