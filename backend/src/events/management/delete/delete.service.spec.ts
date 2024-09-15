import { Test, TestingModule } from '@nestjs/testing';
import { DeleteService } from './delete.service';

describe('DeleteService', () => {
  let service: DeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteService],
    }).compile();

    service = module.get<DeleteService>(DeleteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
