import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import useTitle from '../../app/hooks/useTitle';

function Test() {
  const [title, setTitle] = useTitle();

  return (
    <>
      <h1>{title}</h1>

      <button onClick={() => setTitle('New Title')}>New Title</button>
      <button onClick={() => setTitle('')}>Empty Title</button>
    </>
  );
};

describe('Test hook: useTitle()', async () => {
  test('Ensure default title is correct', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('<unnamed>');
    await expect(localStorage.getItem('title')).toBe('<unnamed>');
  });

  test('Ensure title is updated as expected', async () => {
    const screen = await render(<Test />);

    await screen.getByText('New Title').click();

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('New Title');
    await expect(localStorage.getItem('title')).toBe('New Title');
  });

  test('Ensure title local storage cannot be empty', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Empty Title').click();

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('');
    await expect(localStorage.getItem('title')).not.toBe('');
  });
});
