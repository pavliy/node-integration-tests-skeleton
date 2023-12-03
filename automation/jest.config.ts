const currentPath = 'automation';

const jestConfig = {
  displayName: 'integration',
  projects: undefined,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testMatch: [`<rootDir>${currentPath}/**/?(*.)+(spec|test).[jt]s?(x)`],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  globalSetup: `<rootDir>${currentPath}/jestGlobalSetup.ts`,
  globalTeardown: `<rootDir>${currentPath}/jestGlobalTeardown.ts`,
  setupFilesAfterEnv: [`<rootDir>/${currentPath}/jestTestsSetup.ts`],
};

export default jestConfig;
