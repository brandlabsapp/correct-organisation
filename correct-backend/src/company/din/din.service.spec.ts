import { Test, TestingModule } from '@nestjs/testing';
import { DinService } from './din.service';

describe('DinService', () => {
  let service: DinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinService],
    }).compile();

    service = module.get<DinService>(DinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
