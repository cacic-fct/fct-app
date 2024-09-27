import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('events/:eventId/subscriptions')
@ApiTags('events/{eventId}/subscriptions')
export class EventsSubscriptionsController {
  @Get('')
  getAllEventSubscriptions() {}

  @Post('')
  createEventSubscription() {}

  @Delete('')
  deleteAllEventSubscriptions() {}

  @Get(':subscriptionId')
  getEventSubscription() {}

  @Patch(':subscriptionId')
  updateEventSubscription() {}

  @Delete(':subscriptionId')
  deleteEventSubscription() {}
}
