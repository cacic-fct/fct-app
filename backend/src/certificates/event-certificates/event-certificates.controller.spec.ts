import { Test, TestingModule } from '@nestjs/testing';
import { EventCertificatesController } from './event-certificates.controller';

describe('EventCertificatesController', () => {
  let controller: EventCertificatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventCertificatesController],
    }).compile();

    controller = module.get<EventCertificatesController>(EventCertificatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
