import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseController } from './firebase.controller';
import { FcmService } from './firebase.service';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('FirebaseController', () => {
  let controller: FirebaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseController],
      providers: [
        {
          provide: FcmService,
          useValue: { registerDevice: jest.fn() },
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    controller = module.get<FirebaseController>(FirebaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
