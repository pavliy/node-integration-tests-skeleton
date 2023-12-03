import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import RedisCacheService from '../src/infra/redisCache.service';
import { TestingModule, Test } from '@nestjs/testing';
import { refreshDatabase } from './ormTools';
import { Redis } from 'ioredis';
import { cacheServiceType } from '../src/application/orders/orders.interface';
import { setTimeout } from 'timers/promises';

describe('redisCacheService tests', () => {
  let target: RedisCacheService;
  let app: INestApplication;
  let testModule: TestingModule;
  let redisClient: Redis;

  const fakeJsonItem = { name: 'fake' };
  const fakeKey = 'fakeKey';

  beforeAll(async () => {
    redisClient = new Redis(process.env.REDIS_URL);
  });

  afterAll(async () => {
    await redisClient.flushall();
    redisClient.disconnect();
    await setTimeout(1000);
  });

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = testModule.createNestApplication();
    target = testModule.get<RedisCacheService>(cacheServiceType);
    await refreshDatabase();
    await app.init();
  });

  afterEach(async () => {
    await redisClient.flushall();
    await app?.close();
    await testModule?.close();
  });

  it('should set items into cache', async () => {
    await target.set(fakeKey, fakeJsonItem, 60);
    const cachedItem = await redisClient.get(fakeKey);
    expect(cachedItem).toEqual(JSON.stringify(fakeJsonItem));
  });
});
