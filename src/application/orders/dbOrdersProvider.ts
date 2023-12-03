import { EntityRepository } from '@mikro-orm/core';

import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import Order from '../../domain/order';

@Injectable()
export default class DbOrdersProvider {
  public constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
  ) {}

  public async list(): Promise<Order[]> {
    const result = await this.orderRepository.findAll();
    return result;
  }
}
