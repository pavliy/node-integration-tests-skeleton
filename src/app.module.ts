import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import DbOrdersProvider from './application/orders/dbOrdersProvider';
import GetOrdersHandler from './application/orders/getOrdersHandler';
import Order from './domain/order';
import mikroOrmConfig from './infra/persistence/mikro-orm.config';
import RedisCacheService from './infra/redisCache.service';
import { cacheServiceType } from './application/orders/orders.interface';
import Redis from 'ioredis';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([Order]),
  ],
  controllers: [OrdersController],
  providers: [
    DbOrdersProvider,
    GetOrdersHandler,
    {
      provide: cacheServiceType,
      useFactory: () => new RedisCacheService(new Redis(process.env.REDIS_URL)),
    },
  ],
})
export class AppModule {}
