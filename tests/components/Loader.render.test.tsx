import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import Loader from '../../app/components/Loader';

describe('Test component: <Loader />', async () => {
  test('Ensure loader is rendered', async () => {
    const screen = await render(<Loader hidden={false} />);

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('Loading...');
    await expect(screen.baseElement.querySelector('div[class*="hidden"]')).not.toBeInTheDocument();
  });

  test('Ensure loader can be properly hidden', async () => {
    const screen = await render(<Loader hidden />);

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('Loading...');
    await expect(screen.baseElement.querySelector('div[class*="hidden"]')).toBeInTheDocument();
  });
});
