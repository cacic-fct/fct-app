import { Module } from '@nestjs/common';
import { MajorEventsController } from 'src/major-events/major-events.controller';

@Module({
  controllers: [MajorEventsController],
})
export class MajorEventsModule {}
