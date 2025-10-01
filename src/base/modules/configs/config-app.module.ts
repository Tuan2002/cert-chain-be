import Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // APP
        PORT: Joi.number().default(3000),
        // DATABASE
        MONGODB_URL: Joi.string().required(),
        // JWT
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigAppModule {}
