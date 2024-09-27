import { Test, TestingModule } from '@nestjs/testing';
import { EventsSubscriptionsController } from './events-subscriptions.controller';

describe('SubscriptionsController', () => {
  let controller: EventsSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsSubscriptionsController],
    }).compile();

    controller = module.get<EventsSubscriptionsController>(
      EventsSubscriptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
