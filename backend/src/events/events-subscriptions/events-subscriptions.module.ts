import { Module } from '@nestjs/common';
import { EventsSubscriptionsController } from './events-subscriptions.controller';

@Module({
  controllers: [EventsSubscriptionsController],
})
export class EventsSubscriptionsModule {}
