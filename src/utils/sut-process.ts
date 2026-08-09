import { spawn, type ChildProcess } from 'node:child_process';
import { createConnection } from 'node:net';

export interface RunningProcess {
  name: string;
  process: ChildProcess;
}

const runningProcesses: RunningProcess[] = [];

export function startProcess(
  name: string,
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = {},
): ChildProcess {
  console.log(`\n> ${command} ${args.join(' ')}`);

  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      ...env,
    },
    stdio: 'inherit',
    windowsHide: false,
  });

  child.once('error', (error) => {
    console.error(`[${name}] Failed to start process:`, error);
  });

  child.once('exit', (code, signal) => {
    console.log(`[${name}] exited with code=${code}, signal=${signal}`);
  });

  runningProcesses.push({
    name,
    process: child,
  });

  return child;
}

export function waitForPort(host: string, port: number, timeoutMs = 120_000): Promise<void> {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = createConnection({
        host,
        port,
      });

      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });

      socket.once('error', () => {
        socket.destroy();

        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Timeout waiting for ${host}:${port}`));
          return;
        }

        setTimeout(tryConnect, 500);
      });
    };

    tryConnect();
  });
}

export async function waitForApplication(name: string, host: string, port: number): Promise<void> {
  console.log(`Waiting for ${name} on ${host}:${port}...`);

  await waitForPort(host, port);

  console.log(`✓ ${name} is listening on ${host}:${port}`);
}

function stopProcessTree(pid: number): void {
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(pid), '/T', '/F']);
    return;
  }

  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    // Process may already have exited.
  }
}

export async function stopAllProcesses(): Promise<void> {
  if (runningProcesses.length === 0) {
    console.log('No SUT processes are running.');
    return;
  }

  console.log('\nStopping Conduit SUT...');

  for (const { name, process: child } of runningProcesses) {
    if (!child.pid || child.killed) {
      continue;
    }

    console.log(`Stopping ${name} (PID ${child.pid})...`);

    stopProcessTree(child.pid);
  }

  runningProcesses.length = 0;
}
