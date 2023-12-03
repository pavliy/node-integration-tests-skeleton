import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../src/infra/persistence/mikro-orm.config';

export const refreshDatabase = async (): Promise<void> => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getSchemaGenerator().refreshDatabase();
  await orm.close();
};
