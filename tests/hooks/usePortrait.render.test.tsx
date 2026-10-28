import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import usePortrait from '../../app/hooks/usePortrait';

function Test() {
  const [portrait] = usePortrait();

  return (
    <p>{portrait.toString()}</p>
  );
};

describe('Test hook: usePortrait()', async () => {
  // Note that vitest playwright renders in portrait mode
  test('Ensure portrait is true', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('p')).toHaveTextContent('true');
  });
});
