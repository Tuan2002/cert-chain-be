import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhookController {
  constructor() {}
}
