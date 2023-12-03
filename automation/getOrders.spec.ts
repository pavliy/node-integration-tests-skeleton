import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../src/infra/persistence/mikro-orm.config';
import Order from '../src/domain/order';
import { refreshDatabase } from './ormTools';

describe('get orders tests', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = testModule.createNestApplication();

    await refreshDatabase();
    orm = await MikroORM.init(mikroOrmConfig);
    em = orm.em.fork();

    await app.init();
  });

  afterEach(async () => {
    await orm?.close();
    await app?.close();
    await testModule?.close();
  });

  it('should return orders', async (): Promise<void> => {
    const fakeOrder = new Order('test book');
    await em.persistAndFlush(fakeOrder);

    const appServer = app.getHttpServer();
    const response = await request(appServer).get('/orders').send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([fakeOrder]);
  });
});
