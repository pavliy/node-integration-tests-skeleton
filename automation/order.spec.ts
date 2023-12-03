import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, MikroORM } from '@mikro-orm/core';

import mikroOrmConfig from '../src/infra/persistence/mikro-orm.config';
import Order from '../src/domain/order';
import { AppModule } from '../src/app.module';

describe('salesOrder domain tests', () => {
  let testModule: TestingModule;
  let orm: MikroORM;
  let em: EntityManager;
  let order: Order;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    orm = await MikroORM.init(mikroOrmConfig);
    em = orm.em.fork();
    order = new Order('Book');
  });

  afterEach(async () => {
    await orm.close();
    await testModule.close();
  });

  it('should save order', async () => {
    await em.persistAndFlush(order);

    const receivedOrder = (await em.findOne(Order, order.id))!;
    expect(receivedOrder).toBeDefined();
    expect(receivedOrder.name).toBe('Book');
  });
});
