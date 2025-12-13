import { Test, TestingModule } from '@nestjs/testing';
import { Minios3Service } from './minios3.service';

describe('Minios3Service', () => {
  let service: Minios3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Minios3Service],
    }).compile();

    service = module.get<Minios3Service>(Minios3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
