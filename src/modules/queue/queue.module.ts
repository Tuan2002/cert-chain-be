import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'express-basic-auth';
import { CertificateModule } from '../certificate/certificate.module';
import { MailModule } from '../mail/mail.module';
import { OrganizationModule } from '../organization/organization.module';
import { WebThreeModule } from '../web-three/web-three.module';
import { QueueNames } from './enums';
import {
  CertificateEventProcessor,
  CertificateMailProcessor,
  CertificateTypeEventProcessor,
  OrganizationEventProcessor,
  OrganizationMailProcessor
} from './processors';
import {
  CertificateEventQueueService,
  CertificateMailQueueService,
  CertificateTypeEventQueueService,
  OrganizationEventQueueService,
  OrganizationMailQueueService
} from './services';

@Module({
  imports: [
    forwardRef(() => WebThreeModule),
    OrganizationModule,
    CertificateModule,
    MailModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('REDIS_URL'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: QueueNames.ORGANIZATION_MAILS },
      { name: QueueNames.CERTIFICATE_MAILS },
      { name: QueueNames.ORGANIZATION_EVENTS },
      { name: QueueNames.CERTIFICATE_TYPE_EVENTS },
      { name: QueueNames.CERTIFICATE_EVENTS }
    ),
    BullBoardModule.forFeature(
      {
        name: QueueNames.ORGANIZATION_MAILS,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNames.CERTIFICATE_MAILS,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNames.ORGANIZATION_EVENTS,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNames.CERTIFICATE_TYPE_EVENTS,
        adapter: BullMQAdapter,
      },
      {
        name: QueueNames.CERTIFICATE_EVENTS,
        adapter: BullMQAdapter,
      }
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        challenge: true,
        users: { admin: process.env.BULL_ADMIN_PASSWORD },
      }),
    }),
  ],
  controllers: [],
  providers: [
    OrganizationMailQueueService,
    CertificateMailQueueService,
    OrganizationEventQueueService,
    CertificateTypeEventQueueService,
    CertificateEventQueueService,
    OrganizationMailProcessor,
    CertificateMailProcessor,
    OrganizationEventProcessor,
    CertificateTypeEventProcessor,
    CertificateEventProcessor
  ],
  exports: [
    OrganizationMailQueueService,
    CertificateMailQueueService,
    OrganizationEventQueueService,
    CertificateTypeEventQueueService,
    CertificateEventQueueService
  ],
})
export class QueueModule { }
