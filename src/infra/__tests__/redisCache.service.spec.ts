import { Redis } from 'ioredis';
import { mock, mockClear } from 'jest-mock-extended';
import RedisCacheService from '../redisCache.service';

describe('redisCacheService tests', () => {
  let target: RedisCacheService;
  const redisClientMock = mock<Redis>();
  const fakeKey = 'fakeKey';
  const fakeJsonData = { test: true };

  beforeEach(() => {
    mockClear(redisClientMock);
    target = new RedisCacheService(redisClientMock);
  });

  it('should return item from cache as json object', async () => {
    redisClientMock.get.mockResolvedValue(JSON.stringify(fakeJsonData));
    const cachedItem = await target.get(fakeKey);
    expect(cachedItem).toEqual(fakeJsonData);
  });

  it('should set items into cache with default expiration policy', async () => {
    await target.set(fakeKey, fakeJsonData);
    expect(redisClientMock.set).toHaveBeenCalledWith(
      fakeKey,
      JSON.stringify(fakeJsonData),
      'EX',
      60,
    );
  });

  it('should set items into cache with passed expiration policy', async () => {
    await target.set(fakeKey, fakeJsonData, 100);
    expect(redisClientMock.set).toHaveBeenCalledWith(
      fakeKey,
      JSON.stringify(fakeJsonData),
      'EX',
      100,
    );
  });
});
