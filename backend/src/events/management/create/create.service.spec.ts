import { Test, TestingModule } from '@nestjs/testing';
import { CreateService } from './create.service';

describe('CreateService', () => {
  let service: CreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateService],
    }).compile();

    service = module.get<CreateService>(CreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
