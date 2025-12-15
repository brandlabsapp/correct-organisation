import { Test, TestingModule } from '@nestjs/testing';
import { DinController } from './din.controller';
import { DinService } from './din.service';

describe('DinController', () => {
  let controller: DinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DinController],
      providers: [DinService],
    }).compile();

    controller = module.get<DinController>(DinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
