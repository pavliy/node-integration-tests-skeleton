import { EntitySchema } from '@mikro-orm/core';
import Order from '../../../domain/order';

export const OrderMapper = new EntitySchema<Order>({
  class: Order,
  tableName: 'Orders',
  properties: {
    id: { type: Number, primary: true },
    name: { type: String },
  },
});
