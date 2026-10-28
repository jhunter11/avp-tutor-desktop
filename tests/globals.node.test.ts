import { expect, test, describe } from 'vitest';

import Globals from '../app/globals';

describe('Test globals', async () => {
  test('Ensure AppName is a valid string', async () => {
    await expect(Globals.AppName).toBeTypeOf('string');
    await expect(Globals.AppName).not.toBeFalsy();
  });

  test('Ensure AppVersion is a valid version string', async () => {
    await expect(Globals.AppVersion).toBeTypeOf('string');
    await expect(Globals.AppVersion).toMatch(/^v\d+\.\d+\.\d+(a|b)?$/);
  });

  test('Ensure AppLicense is correct', async () => {
    await expect(Globals.AppLicense).toBeTypeOf('string');
    await expect(Globals.AppLicense).toBe('GPLv3');
  });

  test('Ensure AppURL is a URL', async () => {
    await expect(Globals.AppURL).toBeTypeOf('string');
    await expect(Globals.AppURL).toMatch(/^https?:\/\/.*/);
  });

  test('Ensure AppIssuesURL is a URL', async () => {
    await expect(Globals.AppIssuesURL).toBeTypeOf('string');
    await expect(Globals.AppIssuesURL).toMatch(/^https?:\/\/.*/);
  });

  test('Ensure AppSourceURL is a URL', async () => {
    await expect(Globals.AppSourceURL).toBeTypeOf('string');
    await expect(Globals.AppSourceURL).toMatch(/^https?:\/\/.*/);
  });
});
