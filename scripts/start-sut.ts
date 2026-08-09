import {
  saveProcessIds,
  startProcess,
  stopAllProcesses,
  waitForApplication,
} from '../src/utils/sut-process.js';

import { SUT } from '../src/utils/sut.js';

async function main(): Promise<void> {
  console.log('Starting Conduit SUT...');

  startProcess('Backend', 'bun', ['run', 'dev'], SUT.backend.directory, {
    JWT_SECRET: 'local-development-secret',
  });
  startProcess('Frontend', 'bun', ['run', 'start'], SUT.frontend.directory);

  await saveProcessIds();

  await waitForApplication('Backend', '127.0.0.1', SUT.backend.port);
  await waitForApplication('Frontend', '127.0.0.1', SUT.frontend.port);

  console.log('\n✓ Conduit SUT is ready.');
  console.log(`  Backend:  http://localhost:${SUT.backend.port}`);
  console.log(`  Frontend: http://localhost:${SUT.frontend.port}`);

  await new Promise<void>(() => {
    // Keep SUT running until the process receives SIGINT/SIGTERM.
  });
}

function shutdown(): void {
  stopAllProcesses();
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

main().catch((error: unknown) => {
  console.error('\n✗ Failed to start Conduit SUT.');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  stopAllProcesses();
  process.exit(1);
});
