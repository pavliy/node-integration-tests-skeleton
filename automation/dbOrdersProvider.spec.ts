import { EntityManager, MikroORM } from '@mikro-orm/core';
import DbOrdersProvider from '../src/application/orders/dbOrdersProvider';
import Order from '../src/domain/order';
import mikroOrmConfig from '../src/infra/persistence/mikro-orm.config';
import { refreshDatabase } from './ormTools';

describe('dbOrdersProvider tets', () => {
  let target: DbOrdersProvider;
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    await refreshDatabase();

    orm = await MikroORM.init(mikroOrmConfig);
    em = orm.em.fork();
    target = new DbOrdersProvider(em.getRepository(Order));
  });

  afterEach(async () => {
    await orm.close();
  });

  it('should list orders from database', async () => {
    const fakeOrder = new Order('book');
    await em.persistAndFlush(fakeOrder);

    const foundItems = await target.list();
    expect(foundItems).toEqual([fakeOrder]);
  });
});
