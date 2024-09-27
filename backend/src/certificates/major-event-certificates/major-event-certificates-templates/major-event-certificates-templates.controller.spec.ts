import { Test, TestingModule } from '@nestjs/testing';
import { MajorEventCertificatesTemplatesController } from './major-event-certificates-templates.controller';

describe('MajorEventCertificatesTemplatesController', () => {
  let controller: MajorEventCertificatesTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorEventCertificatesTemplatesController],
    }).compile();

    controller = module.get<MajorEventCertificatesTemplatesController>(
      MajorEventCertificatesTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
