import { Inject, Injectable } from '@nestjs/common';
import DbOrdersProvider from './dbOrdersProvider';
import Order from '../../domain/order';
import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { CacheService, cacheServiceType } from './orders.interface';

@Injectable()
export default class GetOrdersHandler {
  public constructor(
    protected readonly orm: MikroORM,
    private readonly dbOrdersProvider: DbOrdersProvider,
    @Inject(cacheServiceType)
    private readonly cacheService: CacheService,
  ) {}

  @CreateRequestContext()
  public async handle(): Promise<Order[]> {
    const cachedOrders = await this.cacheService.get<Order[]>('orders');
    if (cachedOrders?.length > 0) {
      return cachedOrders;
    }

    const orders = await this.dbOrdersProvider.list();
    this.cacheService.set('orders', orders, 60);
    return orders;
  }
}
