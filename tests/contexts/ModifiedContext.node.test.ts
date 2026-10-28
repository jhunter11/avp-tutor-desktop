import { test, describe, assertType } from 'vitest';
import { type Context } from 'react';

import ModifiedContext from '../../app/contexts/ModifiedContext';

describe('Test context: ModifiedContext', async () => {
  test('Ensure return is a valid Context object', async () => {
    await assertType<
      Context<[
        number | null,
        (modified: number | null) => void,
      ]>
    >(ModifiedContext);
  });
});
