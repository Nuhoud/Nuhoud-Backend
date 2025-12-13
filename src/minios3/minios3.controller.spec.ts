import { Test, TestingModule } from '@nestjs/testing';
import { Minios3Controller } from './minios3.controller';
import { Minios3Service } from './minios3.service';

describe('Minios3Controller', () => {
  let controller: Minios3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Minios3Controller],
      providers: [Minios3Service],
    }).compile();

    controller = module.get<Minios3Controller>(Minios3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
