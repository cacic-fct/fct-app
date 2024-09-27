import { Test, TestingModule } from '@nestjs/testing';
import { IssuedEventCertificatesController } from './issued-event-certificates.controller';

describe('IssuedEventCertificatesController', () => {
  let controller: IssuedEventCertificatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuedEventCertificatesController],
    }).compile();

    controller = module.get<IssuedEventCertificatesController>(
      IssuedEventCertificatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
