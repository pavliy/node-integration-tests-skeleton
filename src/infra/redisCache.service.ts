import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheService } from '../application/orders/orders.interface';

@Injectable()
export default class RedisCacheService
  implements CacheService, OnModuleDestroy
{
  public constructor(private readonly redisClient: Redis) {}
  public onModuleDestroy() {
    this.redisClient.disconnect();
  }

  public async get<T>(key: string): Promise<T> {
    const value = await this.redisClient.get(key);
    return JSON.parse(value) as T;
  }

  public async set(
    key: string,
    cacheValue: unknown,
    ttl?: number,
  ): Promise<void> {
    this.redisClient.set(key, JSON.stringify(cacheValue), 'EX', ttl ?? 60);
  }
}
