import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import useModified from '../../app/hooks/useModified';

function Test() {
  const [modified, setModified] = useModified();

  return (
    <>
      <p>{modified}</p>
      <button onClick={() => setModified((modified || 0) + 1)}>Inc</button>
    </>
  );
};

describe('Test hook: useModified()', async () => {
  test('Ensure state updates as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('p')).toHaveTextContent('0');

    await screen.getByText('Inc').click();
    await expect(screen.baseElement.querySelector('p')).toHaveTextContent('1');

    await screen.getByText('Inc').click();
    await expect(screen.baseElement.querySelector('p')).toHaveTextContent('2');
  });
});
