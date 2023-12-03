import GetOrdersHandler from '../src/application/orders/getOrdersHandler';
import { refreshDatabase } from './ormTools';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../src/infra/persistence/mikro-orm.config';
import Order from '../src/domain/order';

describe('getOrdersHandler tests', () => {
  let target: GetOrdersHandler;
  let testModule: TestingModule;
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    await refreshDatabase();
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    orm = await MikroORM.init(mikroOrmConfig);
    em = orm.em.fork();
    target = testModule.get<GetOrdersHandler>(GetOrdersHandler);
  });

  afterEach(async () => {
    await orm.close();
    await testModule.close();
  });

  it('should get orders from database', async () => {
    const fakeOrder = new Order('test book');
    await em.persistAndFlush(fakeOrder);

    const result = await target.handle();
    expect(result).toEqual([fakeOrder]);
  });

  it('should set orders into cache', async () => {
    const fakeOrder = new Order('book');
    await em.persistAndFlush(fakeOrder);

    await target.handle();
    const cachedOrders = await em.find(Order, {});
    expect(cachedOrders).toEqual([fakeOrder]);
  });
});
