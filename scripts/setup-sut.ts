import { execFile } from 'node:child_process';
import { access, mkdir } from 'node:fs/promises';
import { promisify } from 'node:util';

import { SUT, SUT_ROOT } from '../src/utils/sut.js';

const execFileAsync = promisify(execFile);

async function run(command: string, args: string[], cwd?: string): Promise<void> {
  console.log(`\n> ${command} ${args.join(' ')}`);

  await execFileAsync(command, args, {
    cwd,
    windowsHide: false,
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync(command, ['--version']);
    return true;
  } catch {
    return false;
  }
}

async function assertPrerequisites(): Promise<void> {
  console.log('Checking prerequisites...\n');

  for (const command of ['git', 'bun']) {
    if (!(await commandExists(command))) {
      throw new Error(`${command} is required but was not found in PATH.`);
    }

    console.log(`✓ ${command}`);
  }
}

async function isGitRepository(directory: string): Promise<boolean> {
  try {
    await access(`${directory}/.git`);
    return true;
  } catch {
    return false;
  }
}

async function prepareRepository(
  repository: string,
  commit: string,
  directory: string,
): Promise<void> {
  const exists = await isGitRepository(directory);

  if (!exists) {
    console.log(`\nCloning ${repository}...`);

    await run('git', ['clone', repository, directory]);
  }

  await run('git', ['fetch', '--all', '--tags'], directory);

  await run('git', ['checkout', '--detach', commit], directory);
}

async function prepareBackend(): Promise<void> {
  console.log('\n=== Backend ===');

  await prepareRepository(SUT.backend.repository, SUT.backend.commit, SUT.backend.directory);

  await run('bun', ['install'], SUT.backend.directory);
  await run('bun', ['run', 'prepare'], SUT.backend.directory);
  await run('bun', ['run', 'db:generate'], SUT.backend.directory);
  await run('bun', ['run', 'db:push'], SUT.backend.directory);
}

async function prepareFrontend(): Promise<void> {
  console.log('\n=== Frontend ===');

  await prepareRepository(SUT.frontend.repository, SUT.frontend.commit, SUT.frontend.directory);

  await run('bun', ['run', 'setup'], SUT.frontend.directory);
}

async function main(): Promise<void> {
  console.log('Preparing Conduit SUT...\n');

  await assertPrerequisites();

  await mkdir(SUT_ROOT, { recursive: true });

  await prepareBackend();
  await prepareFrontend();

  console.log('\n✓ Conduit SUT is ready.');
}

main().catch(async (error: unknown) => {
  console.error('\n✗ SUT setup failed.');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
