import { getDefaultEnvVars } from './jestGlobalSetup';

afterAll(() => {
  process.env = getDefaultEnvVars();
});
