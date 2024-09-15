import { Test, TestingModule } from '@nestjs/testing';
import { MajorEventsController } from './major-events.controller';

describe('MajorEventsController', () => {
  let controller: MajorEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorEventsController],
    }).compile();

    controller = module.get<MajorEventsController>(MajorEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
