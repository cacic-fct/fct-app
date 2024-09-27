import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('major-events/:majorEventId/subscriptions')
@ApiTags('major-events/{majorEventId}/subscriptions')
export class MajorEventsSubscriptionsController {
  @Get('')
  getAllMajorEventSubscriptions() {}

  @Post('')
  createMajorEventSubscription() {}

  @Delete('')
  deleteAllMajorEventSubscriptions() {}

  @Get(':subscriptionId')
  getMajorEventSubscription() {}

  @Patch(':subscriptionId')
  updateMajorEventSubscription() {}

  @Delete(':subscriptionId')
  deleteMajorEventSubscription() {}
}
