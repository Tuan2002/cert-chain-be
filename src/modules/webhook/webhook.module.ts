import { QueueModule } from '@modules/queue/queue.module';
import { Module } from '@nestjs/common';
import { WebhookController } from './controllers';
@Module({
  imports: [QueueModule],
  controllers: [WebhookController],
  providers: [
],
  exports: [],
})
export class WebhookModule {}
