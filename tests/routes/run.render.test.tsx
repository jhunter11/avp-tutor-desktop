import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import Run from '../../app/routes/run';

describe('Test route: run', async () => {
  test('Check that AppFrame is rendered', async () => {
    const screen = await render(<Run />);

    await expect(screen.baseElement.querySelector('main')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('header')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('footer')).toBeInTheDocument();
  });

  test('Check that Visualizer is rendered', async () => {
    const screen = await render(<Run />);

    await expect(screen.baseElement.querySelector('button[title="Step Backward"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Step Forward"]')).toBeInTheDocument();
  });
});
