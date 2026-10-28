import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import Wiki from '../../app/routes/wiki';

describe('Test route: wiki', async () => {
  test.todo('TODO', async () => {
    const screen = await render(<Wiki />);

    await expect(screen).not.toBeNull();
  });
});
