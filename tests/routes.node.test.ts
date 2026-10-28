import { expect, test, describe, assertType } from 'vitest';
import { type RouteConfig } from '@react-router/dev/routes';

import Routes from '../app/routes';

describe('Test routes', async () => {
  test('Ensure return is a valid RouteConfig object', async () => {
    await assertType<RouteConfig>(Routes);
  });

  test('Ensure at least one route is specified', async () => {
    await expect(Routes.length).toBeGreaterThan(0);
  });

  test('Ensure the index route is unique', async () => {
    let indexRouteCount = 0;

    Routes.forEach(async route => indexRouteCount += (route.index) ? 1 : 0);
    await expect(indexRouteCount).toBe(1);
  });

  test('Ensure each route path matches its filename', async () => {
    Routes.forEach(async (route) => {
      await expect(route.file).toBe(`routes/${route.index ? 'index' : route.path}.tsx`);
    });
  });

  test('Ensure each route actually exists', async () => {
    Routes.forEach(async (route) => {
      await expect(
        import(`../app/routes/${route.index ? 'index' : route.path}.tsx`),
      ).resolves.toBeDefined();
    });
  });
});
