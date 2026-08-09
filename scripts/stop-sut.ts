import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SUT_PORTS = [3000, 4200];

async function getProcessIdByPort(port: number): Promise<number | undefined> {
  if (process.platform === 'win32') {
    try {
      const { stdout } = await execFileAsync(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          `
            $connection = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue |
              Select-Object -First 1

            if ($connection) {
              $connection.OwningProcess
            }
          `,
        ],
        {
          windowsHide: true,
        },
      );

      const pid = Number(stdout.trim());

      return Number.isInteger(pid) && pid > 0 ? pid : undefined;
    } catch {
      return undefined;
    }
  }

  try {
    const { stdout } = await execFileAsync('lsof', ['-ti', `:${port}`]);

    const pid = Number(stdout.trim().split('\n')[0]);

    return Number.isInteger(pid) && pid > 0 ? pid : undefined;
  } catch {
    return undefined;
  }
}

async function stopProcessTree(pid: number): Promise<void> {
  if (process.platform === 'win32') {
    await execFileAsync('taskkill', ['/PID', String(pid), '/T', '/F'], {
      windowsHide: true,
    });

    return;
  }

  process.kill(pid, 'SIGTERM');
}

async function main(): Promise<void> {
  console.log('Stopping Conduit SUT...\n');

  for (const port of SUT_PORTS) {
    const pid = await getProcessIdByPort(port);

    if (!pid) {
      console.log(`Port ${port}: already free.`);
      continue;
    }

    console.log(`Port ${port}: stopping process ${pid}...`);

    try {
      await stopProcessTree(pid);
      console.log(`✓ Port ${port} is being released.`);
    } catch (error) {
      console.error(`✗ Failed to stop process ${pid} on port ${port}.`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  console.log('\n✓ Conduit SUT stopped.');
}

main().catch((error: unknown) => {
  console.error('Failed to stop Conduit SUT.');

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
