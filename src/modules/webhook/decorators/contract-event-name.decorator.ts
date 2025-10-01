import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Interface, InterfaceAbi } from 'ethers';
import { WEBHOOK_CONTRACT_ABI } from '../constants';
import { RawWebhookEvent } from '../types';

export const ContractEventName = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const reflector = new Reflector();
    const contractAbi = reflector.get<InterfaceAbi>(
      WEBHOOK_CONTRACT_ABI,
      ctx.getHandler(),
    );

    // Get the webhook body
    const webhookBody: RawWebhookEvent = request.body;
    if (!webhookBody?.event?.data?.block?.logs) {
      throw new BadRequestException('Invalid webhook data structure');
    }

    // Parse the event using ethers.js
    const contractInterface = Interface.from(contractAbi);
    const log = webhookBody.event.data.block.logs[0];
    const parsedEvent = contractInterface.parseLog(log);
    if (!parsedEvent) {
      throw new BadRequestException('Failed to parse event from webhook data');
    }

    return parsedEvent.name;
  },
);
