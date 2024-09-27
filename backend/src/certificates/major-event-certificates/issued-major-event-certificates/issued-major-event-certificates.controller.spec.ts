import { Test, TestingModule } from '@nestjs/testing';
import { IssuedMajorEventCertificatesController } from './issued-major-event-certificates.controller';

describe('IssuedMajorEventCertificatesController', () => {
  let controller: IssuedMajorEventCertificatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuedMajorEventCertificatesController],
    }).compile();

    controller = module.get<IssuedMajorEventCertificatesController>(
      IssuedMajorEventCertificatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
