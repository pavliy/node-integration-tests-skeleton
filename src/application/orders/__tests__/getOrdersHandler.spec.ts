import { ByPassDecorator } from '../../../__tests__/utils';

jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  CreateRequestContext: ByPassDecorator,
}));

import Order from '../../../domain/order';
import DbOrdersProvider from '../dbOrdersProvider';
import GetOrdersHandler from '../getOrdersHandler';
import { mock } from 'jest-mock-extended';
import { CacheService } from '../orders.interface';
import { MikroORM } from '@mikro-orm/core';

describe('getOrdersHandler tests', () => {
  let target: GetOrdersHandler;
  const ormMock = mock<MikroORM>();
  const dbOrdersProviderMock = mock<DbOrdersProvider>();
  const cacheServiceMock = mock<CacheService>();
  const fakeDbOrders = [new Order('Book')];

  beforeEach(() => {
    jest.clearAllMocks();
    target = new GetOrdersHandler(
      ormMock,
      dbOrdersProviderMock,
      cacheServiceMock,
    );
    dbOrdersProviderMock.list.mockResolvedValue(fakeDbOrders);
  });

  it('should return orders from database', async () => {
    const foundOrders = await target.handle();
    expect(foundOrders).toEqual(fakeDbOrders);
  });

  it('should set orders into cache', async () => {
    await target.handle();
    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      'orders',
      fakeDbOrders,
      60,
    );
  });

  it('should get orders from cache', async () => {
    const anotherOrder = new Order('Another Book');
    cacheServiceMock.get.mockResolvedValue([anotherOrder]);
    const cachedOrders = await target.handle();

    expect(cachedOrders).toEqual([anotherOrder]);
    expect(dbOrdersProviderMock.list).not.toHaveBeenCalled();
  });
});
