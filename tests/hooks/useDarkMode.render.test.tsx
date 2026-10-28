import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import useDarkMode from '../../app/hooks/useDarkMode';

function Test() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <>
      <p>{(isDark || false).toString()}</p>
      <button onClick={() => setIsDark(true)}>Enable</button>
      <button onClick={() => setIsDark(false)}>Disable</button>
    </>
  );
};

describe('Test hook: useDarkMode()', async () => {
  test('Check if \'isDark\' is a boolean', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText(/(true|false)/i)).toBeInTheDocument();
  });

  test('Enable dark mode', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Enable').click();
    await expect(screen.getByText('true')).toBeInTheDocument();
    await expect(screen.baseElement.classList.contains('dark')).toBe(true);
  });

  test('Disable dark mode', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Disable').click();
    await expect(screen.getByText('false')).toBeInTheDocument();
    await expect(screen.baseElement.classList.contains('dark')).toBe(false);
  });
});
