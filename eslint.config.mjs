import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/', '.sut/'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
]);
