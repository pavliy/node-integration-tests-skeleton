/* eslint-disable no-console */
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

let firstRun = true;
let defaultProcessEnv: NodeJS.ProcessEnv = {};
let redisPort: number;

// eslint-disable-next-line no-array-constructor
global.containers = new Array<StartedTestContainer>();
let pgDatabasePort: number;

const showPortsInfo = (): void => {
  console.info('\n', '=====================');

  console.info('\n', 'Postgres DB        : ', pgDatabasePort);
};

const setupRedisContainer = async (): Promise<StartedTestContainer> => {
  const redisContainer = new GenericContainer(
    'redis:6.0.5-buster',
  ).withExposedPorts(6379);
  const redisContainerInstance = await redisContainer.start();
  redisPort = redisContainerInstance.getMappedPort(6379);
  console.info(
    '\n',
    `Started Redis container "${redisContainerInstance.getName()}"`,
  );
  console.info('\n', `Redis port: ${redisPort}`);
  global.containers.push(redisContainerInstance);

  return redisContainerInstance;
};

const globalBefore = async (): Promise<void> => {
  process.env.SYSTEM_TEST_FIRST_RUN = firstRun ? 'yes' : 'no';

  if (!firstRun) {
    console.info('\n', 'Test containers setup skipped, already started');
    showPortsInfo();
    return;
  }

  console.info('\n', 'Setup started');

  const pgContainer = await new PostgreSqlContainer('postgres:15.2').start();
  pgDatabasePort = pgContainer.getFirstMappedPort();
  console.info(
    '\n',
    `Started DB container "${pgContainer.getName()}" on port "${pgDatabasePort}"`,
  );
  global.containers.push(pgContainer);

  await setupRedisContainer();

  defaultProcessEnv = {
    ...process.env,
    ...{
      TESTS_RUN: 'system',
      NODE_ENV: 'system-tests',
      DATABASE_URL: pgContainer.getConnectionUri(),
      REDIS_URL: `redis://localhost:${redisPort}`,
      MIN_LOG_LEVEL: 'info',
      DB_ORM_DEBUG: 'false',
    },
  };

  process.env = defaultProcessEnv;

  console.info('\n', 'Executing database migrations');
  const ormConfig = (await import('../src/infra/persistence/mikro-orm.config'))
    .default;
  const orm = await MikroORM.init(ormConfig);
  await orm.getMigrator().up();
  console.info('\n', 'Executing database migrations done');

  await orm.close();

  firstRun = false;

  showPortsInfo();
};

export default globalBefore;

export const getDefaultEnvVars = (): NodeJS.ProcessEnv => defaultProcessEnv;
