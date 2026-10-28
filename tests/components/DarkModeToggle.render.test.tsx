import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';
import { useState } from 'react';

import useDarkMode from '../../app/hooks/useDarkMode';
import DarkModeToggle from '../../app/components/DarkModeToggle';

function Test() {
  const [floating, setFloating] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  return (
    <>
      <DarkModeToggle
        floating={floating}
        isDark={isDark}
        setIsDark={setIsDark}
        showInPortrait={true}
      />

      <button onClick={() => setFloating(true)}>Set Floating</button>
      <button onClick={() => setFloating(false)}>Set Not Floating</button>
    </>
  );
};

describe('Test component: <DarkModeToggle />', async () => {
  test('Ensure button can toggle dark mode', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('button[aria-label$="Dark Mode"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.classList.contains('dark')).toBe(true);

    await (screen.baseElement.querySelector('button[aria-label$="Dark Mode"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.classList.contains('dark')).toBe(false);
  });

  test('Ensure floating button has correct opacity', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Floating').click();
    await expect(screen.baseElement.querySelector('button[aria-label$="Dark Mode"]')?.classList.contains('opacity-50')).toBe(true);
  });

  test('Ensure non-floating button has correct opacity', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Not Floating').click();
    await expect(screen.baseElement.querySelector('button[aria-label$="Dark Mode"]')?.classList.contains('opacity-100')).toBe(true);
  });
});
