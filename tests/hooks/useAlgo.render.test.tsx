import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import useAlgo from '../../app/hooks/useAlgo';

function Test() {
  const [title, setTitle] = useState('Test');
  const [loaderHidden, setLoaderHidden] = useState(true);

  const [
    src,
    setSrc,
    comp,
  ] = useAlgo({ setTitle, setLoaderHidden });

  return (
    <>
      <h1>{title}</h1>

      <p id="src">{src}</p>
      <p id="comp">{JSON.stringify(comp, null, 2)}</p>
      <p id="hidden">{loaderHidden ? 'true' : 'false'}</p>

      <button onClick={() => setSrc('new source')}>Set Src</button>
    </>
  );
};

describe('Test hook: useAlgo()', async () => {
  test('Ensure title is set as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('<unnamed>');
  });

  test('Ensure state is set as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('');
    await expect(screen.baseElement.querySelector('#comp')).toHaveTextContent('[]');
    await expect(screen.baseElement.querySelector('#hidden')).toHaveTextContent('true');
  });

  test('Ensure state is updated as expected', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Src').click();
    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('new source');
    await expect(screen.baseElement.querySelector('#comp')).toHaveTextContent('[]'); // TODO: Update comp
    await expect(screen.baseElement.querySelector('#hidden')).toHaveTextContent('true');
  });
});
