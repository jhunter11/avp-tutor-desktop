import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import Index from '../../app/routes/index';

describe('Test route: index', async () => {
  test('Check that AppFrame is rendered', async () => {
    const screen = await render(<Index />);

    await expect(screen.baseElement.querySelector('main')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('header')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('footer')).toBeInTheDocument();
  });

  test('Check that SearchProvider is rendered', async () => {
    const screen = await render(<Index />);

    await expect(screen.baseElement.querySelector('form input[type="search"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('form button[role="combobox"]')).toBeInTheDocument();
  });

  test('Check that at least one SearchCard is rendered', async () => {
    const screen = await render(<Index />);

    await expect(screen.baseElement.querySelector('a > img + div + div')).toBeInTheDocument();
  });
});
