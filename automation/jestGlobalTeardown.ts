/* eslint-disable no-console */
const globalTeardown = async (config: any): Promise<void> => {
  console.info('\n', 'Executing teardown for tests');
  if (config.watch || config.watchAll) {
    return;
  }

  await Promise.all(
    global.containers.map((container) => container.stop({ timeout: 10000 })),
  );

  console.info('\n', 'Teardown completed');
};

export default globalTeardown;
