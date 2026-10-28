import { expect, test, describe } from 'vitest';

import App, { Layout, ErrorBoundary } from '../app/root';

describe('Test root component', async () => {
  test('Ensure App exports the React Router Outlet', async () => {
    await expect(App().type.name).toBe('Outlet');
  });

  test('Ensure Layout exports the html root element', async () => {
    await expect(Layout({ children: <></> }).type.toString()).toBe('html');
  });

  test('Ensure ErrorBoundary exports a valid Layout', async () => {
    await expect(ErrorBoundary({} as any).type.name).toBe('Layout');
  });
});
