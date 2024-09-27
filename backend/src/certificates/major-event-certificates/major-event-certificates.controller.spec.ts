import { Test, TestingModule } from '@nestjs/testing';
import { MajorEventCertificatesController } from './major-event-certificates.controller';

describe('MajorEventCertificatesController', () => {
  let controller: MajorEventCertificatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorEventCertificatesController],
    }).compile();

    controller = module.get<MajorEventCertificatesController>(
      MajorEventCertificatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
