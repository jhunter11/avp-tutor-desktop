import { expect, test, describe, assertType } from 'vitest';

import monaco from 'monaco-editor';

import Defs from '../app/defs';

describe('Test defs', async () => {
  test('Ensure AVPLanguage is defined as a valid monaco language', async () => {
    await expect(Defs.AVPLanguage).toBeDefined();
    await expect(Defs.AVPLanguage).not.toBeNull();
    await assertType<monaco.languages.IMonarchLanguage>(Defs.AVPLanguage);
  });

  test('Ensure AVPDarkTheme is defined as a valid monaco theme', async () => {
    await expect(Defs.AVPDarkTheme).toBeDefined();
    await expect(Defs.AVPDarkTheme).not.toBeNull();
    await assertType<monaco.editor.IStandaloneThemeData>(Defs.AVPDarkTheme);
  });

  test('Ensure AVPLightTheme is defined as a valid monaco theme', async () => {
    await expect(Defs.AVPLightTheme).toBeDefined();
    await expect(Defs.AVPLightTheme).not.toBeNull();
    await assertType<monaco.editor.IStandaloneThemeData>(Defs.AVPLightTheme);
  });
});
