import { Module } from '@nestjs/common';
import { MajorEventsSubscriptionsController } from './major-events-subscriptions.controller';

@Module({
  controllers: [MajorEventsSubscriptionsController],
})
export class SubscriptionsModule {}
