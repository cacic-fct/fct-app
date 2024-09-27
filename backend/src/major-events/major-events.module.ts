import { Module } from '@nestjs/common';
import { MajorEventsController } from 'src/major-events/major-events.controller';
import { SubscriptionsModule } from './major-events-subscriptions/major-events-subscriptions.module';

@Module({
  controllers: [MajorEventsController],
  imports: [SubscriptionsModule],
})
export class MajorEventsModule {}
