import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Interface, InterfaceAbi } from 'ethers';
import _ from 'lodash';
import { WEBHOOK_CONTRACT_ABI } from '../constants';
import { ContractEventType, RawWebhookEvent } from '../types';

export const ContractEventBody = createParamDecorator(
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
    const contractLogs = webhookBody.event.data.block.logs;
    const eventLog = _.findLast(contractLogs, (log) => {
      const parsedLog = contractInterface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      return parsedLog && parsedLog?.fragment?.type === 'event';
    });

    if (!eventLog) {
      throw new BadRequestException(
        `No event found in logs matching the contract ABI`,
      );
    }
    const parsedEvent = contractInterface.parseLog(eventLog);
    if (!parsedEvent || !parsedEvent.args) {
      throw new BadRequestException(`Failed to parse event from webhook data`);
    }

    const contractEventBody: ContractEventType = {
      eventData: [...parsedEvent.args],
      _eventLog: eventLog,
    };

    return contractEventBody;
  },
);
