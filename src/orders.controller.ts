import { Controller, Get } from '@nestjs/common';
import GetOrdersHandler from './application/orders/getOrdersHandler';
import Order from './domain/order';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersHandler: GetOrdersHandler) {}

  @Get()
  getOrders(): Promise<Order[]> {
    return this.ordersHandler.handle();
  }
}
