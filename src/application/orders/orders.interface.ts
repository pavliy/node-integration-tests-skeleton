export const cacheServiceType = Symbol('CacheService');

export interface CacheService {
  get<T>(key: string): Promise<T>;
  set(key: string, cacheValue: unknown, ttl?: number): Promise<void>;
}
