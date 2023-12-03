import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { mock, mockClear } from 'jest-mock-extended';
import Order from '../../../domain/order';
import DbOrdersProvider from '../dbOrdersProvider';

describe('dbOrdersProvider tests', () => {
  const ordersRepositoryStub = mock<EntityRepository<Order>>();
  let target: DbOrdersProvider;

  beforeEach(() => {
    mockClear(ordersRepositoryStub);
    target = new DbOrdersProvider(ordersRepositoryStub);
  });

  it('should return orders from database', async () => {
    const fakeOrders = [mock<Order>(), mock<Order>()];
    ordersRepositoryStub.findAll.mockResolvedValue(fakeOrders);

    const foundOrders = await target.list();

    expect(foundOrders).toEqual(fakeOrders);
  });
});
