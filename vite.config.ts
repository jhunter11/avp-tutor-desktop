import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

import Globals from './app/globals';

export default defineConfig({
  plugins: [
    !process.env.VITEST && reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  base: Globals.RouteBaseName,
  server: {
    proxy: {
      [`${Globals.RouteBaseName}api`]: {
        target: 'http://127.0.0.1:8781',
        rewrite: path => path.slice(Globals.RouteBaseName.length - 1),
      },
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'node',
          include: [
            '**/*.node.test.{ts,tsx}',
          ],
        },
      },
      {
        test: {
          name: 'browser',
          include: [
            '**/*.render.test.{ts,tsx}',
          ],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotDirectory: 'screenshots',
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' },
            ],
          },
        },
      },
    ],
  },
});
