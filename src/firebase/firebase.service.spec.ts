import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FcmService } from './firebase.service';
import { FIREBASE_ADMIN } from './firebase.constants';
import { DeviceToken } from '../devices/schemas/device-token.schema';
import { getMessaging } from 'firebase-admin/messaging';

jest.mock('firebase-admin/messaging', () => ({
  getMessaging: jest.fn(),
}));

describe('FcmService', () => {
  let service: FcmService;

  const messagingMock = {
    send: jest.fn().mockResolvedValue('message-id'),
    sendEachForMulticast: jest.fn().mockResolvedValue({
      successCount: 0,
      failureCount: 0,
      responses: [],
    }),
    sendToTopic: jest.fn().mockResolvedValue('topic-id'),
  };

  const findQueryMock = {
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const modelMock = {
    findOneAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    find: jest.fn().mockReturnValue(findQueryMock),
    deleteMany: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    deleteOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
  };

  beforeEach(async () => {
    (getMessaging as jest.Mock).mockReturnValue(messagingMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FcmService,
        {
          provide: FIREBASE_ADMIN,
          useValue: {},
        },
        {
          provide: getModelToken(DeviceToken.name),
          useValue: modelMock,
        },
      ],
    }).compile();

    service = module.get<FcmService>(FcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('registerDevice should upsert token', async () => {
    const userId = new Types.ObjectId().toString();
    await service.registerDevice(userId, 'test-token', 'web');
    expect(modelMock.findOneAndUpdate).toHaveBeenCalled();
  });
});
