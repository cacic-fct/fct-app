import { Test, TestingModule } from '@nestjs/testing';
import { MajorEventsSubscriptionsController } from './major-events-subscriptions.controller';

describe('SubscriptionsController', () => {
  let controller: MajorEventsSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorEventsSubscriptionsController],
    }).compile();

    controller = module.get<MajorEventsSubscriptionsController>(
      MajorEventsSubscriptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
