import {
  DynamicPassword,
  EntityCaseNamingStrategy,
  Options,
} from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { parse, ConnectionOptions } from 'pg-connection-string';

const initConnectionOptions = (): ConnectionOptions => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Database url must be defined in env vars');
  }

  const dbOptions = parse(process.env.DATABASE_URL);
  if (
    !dbOptions.host ||
    !dbOptions.user ||
    !dbOptions.port ||
    !dbOptions.database
  ) {
    throw new Error('Wrong database options. Check env vars configuration');
  }

  return dbOptions;
};
const connectionOptions: ConnectionOptions = initConnectionOptions();

const getDbPassword = async (): Promise<DynamicPassword> => {
  return {
    password: connectionOptions.password,
  };
};

const mikroOrmOptions: Options = {
  type: 'postgresql',
  entities: ['**/persistence/mapping/*.js'],
  entitiesTs: ['**/persistence/mapping/*.ts'],
  dbName: connectionOptions.database!,
  host: connectionOptions.host!,
  port: Number(connectionOptions.port!),
  user: connectionOptions.user!,
  password: () => getDbPassword(),
  driver: PostgreSqlDriver,
  namingStrategy: EntityCaseNamingStrategy,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN) || 0,
    max: Number(process.env.DB_POOL_MAX) || 10,
  },
};

export default {
  ...mikroOrmOptions,
};
