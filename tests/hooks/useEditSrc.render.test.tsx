import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import useEditSrc from '../../app/hooks/useEditSrc';

function Test() {
  const [src, setSrc] = useState('original source');
  const [lastAction, setLastAction] = useState('none');

  const [
    editSrc,
    setEditSrc,
    save,
    discard,
  ] = useEditSrc({
    src,
    setSrc,
    onSave: () => setLastAction('save'),
    onDiscard: () => setLastAction('discard'),
  });

  return (
    <>
      <p id="src">{src}</p>
      <p id="edit-src">{editSrc}</p>
      <p id="last-action">{lastAction}</p>

      <button onClick={() => setSrc('new original source')}>Set OG Src</button>

      <button onClick={() => setEditSrc('new source')}>Set Src 1</button>
      <button onClick={() => setEditSrc('test source')}>Set Src 2</button>
      <button onClick={() => setEditSrc('abc123')}>Set Src 3</button>

      <button onClick={save}>Save</button>
      <button onClick={discard}>Discard</button>
    </>
  );
};

describe('Test hook: useEditSrc()', async () => {
  test('Ensure edit source starts off identical to source', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('original source');
  });

  test('Ensure updating source updates edit source', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set OG Src').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('new original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('new original source');
  });

  test('Ensure updating edit source does not update source', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Src 1').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('new source');
  });

  test('Ensure saving updates source and triggers onSave', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Src 2').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('test source');
    await expect(screen.baseElement.querySelector('#last-action')).toHaveTextContent('none');

    await screen.getByText('Save').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('test source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('test source');
    await expect(screen.baseElement.querySelector('#last-action')).toHaveTextContent('save');
  });

  test('Ensure discarding updates source and triggers onDiscard', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Src 3').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('abc123');
    await expect(screen.baseElement.querySelector('#last-action')).toHaveTextContent('none');

    await screen.getByText('Discard').click();

    await expect(screen.baseElement.querySelector('#src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#edit-src')).toHaveTextContent('original source');
    await expect(screen.baseElement.querySelector('#last-action')).toHaveTextContent('discard');
  });
});
