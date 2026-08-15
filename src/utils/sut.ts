import path from 'node:path';

export const SUT_ROOT = path.resolve('.sut');

export const SUT_PATCH = path.resolve('patches/conduit-local-api.patch');

export const SUT_PROCESS_FILE = path.join(SUT_ROOT, 'processes.json');

export const SUT = {
  backend: {
    repository: 'https://github.com/realworld-apps/nitro-prisma-zod-realworld-example-app.git',
    commit: 'c8c66858a436a6e07f445fffe2253a65ff6dcb58',
    directory: path.join(SUT_ROOT, 'backend'),
    port: 3000,
  },

  frontend: {
    repository: 'https://github.com/realworld-apps/angular-realworld-example-app.git',
    commit: 'f39866e5241477f3b891a045edfaedf82792be5e',
    directory: path.join(SUT_ROOT, 'frontend'),
    port: 4200,
  },
} as const;
