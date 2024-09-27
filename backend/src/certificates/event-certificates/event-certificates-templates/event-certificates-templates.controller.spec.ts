import { Test, TestingModule } from '@nestjs/testing';
import { EventCertificatesTemplatesController } from './event-certificates-templates.controller';

describe('EventCertificatesTemplatesController', () => {
  let controller: EventCertificatesTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventCertificatesTemplatesController],
    }).compile();

    controller = module.get<EventCertificatesTemplatesController>(
      EventCertificatesTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
