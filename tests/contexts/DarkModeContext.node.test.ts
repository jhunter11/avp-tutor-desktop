import { test, describe, assertType } from 'vitest';
import { type Context } from 'react';

import DarkModeContext from '../../app/contexts/DarkModeContext';

describe('Test context: DarkModeContext', async () => {
  test('Ensure return is a valid Context object', async () => {
    await assertType<Context<boolean>>(DarkModeContext);
  });
});
