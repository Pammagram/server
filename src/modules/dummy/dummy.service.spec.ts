import { AuthService } from '@modules/auth';
import { Test, TestingModule } from '@nestjs/testing';

import { DummyService } from './dummy.service';

describe('DummyService', () => {
  let service: DummyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DummyService, AuthService],
    }).compile();

    service = module.get<DummyService>(DummyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
