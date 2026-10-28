import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useRef } from 'react';
import { Iconoir } from 'iconoir-react';

import MainMenu from '../../app/components/MainMenu';

function Test() {
  const triggerRef = useRef<HTMLElement>({} as HTMLElement);
  const panelRef = useRef<HTMLElement>({} as HTMLElement);

  return (
    <>
      <MainMenu
        isDark={false}
        setIsDark={() => {}}
        triggerRef={triggerRef}
        panelRef={panelRef}
        links={[
          {
            icon: Iconoir,
            text: 'Button A',
            separateNext: false,
            onClick: () => document.getElementById('test')!.innerHTML = 'Button A Clicked',
          },
          {
            icon: Iconoir,
            text: 'Button B',
            separateNext: true,
            onClick: () => document.getElementById('test')!.innerHTML = 'Button B Clicked',
          },
        ]}
      />
      <p id="test"></p>
    </>
  );
};

describe('Test component: <MainMenu />', async () => {
  test('Ensure toggle button is rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('body button[aria-haspopup]')).toBeInTheDocument();
  });

  test('Ensure drawer is not rendered at first', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Miami University')).not.toBeInTheDocument();
  });

  test('Ensure drawer is rendered on button click', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('body button[aria-haspopup]') as HTMLButtonElement | null)?.click();
    await expect(screen.getByText('Miami University')).toBeInTheDocument();
  });

  test('Ensure links are rendered in drawer', async () => {
    const screen = await render(<Test />);
    await (screen.baseElement.querySelector('body button[aria-haspopup]') as HTMLButtonElement | null)?.click();

    await screen.baseElement.querySelectorAll('ul a li')
      .forEach(async link => await expect(link).toHaveTextContent(/Button A|B/));
  });

  test('Ensure clicking links works as expected', async () => {
    const screen = await render(<Test />);
    await (screen.baseElement.querySelector('body button[aria-haspopup]') as HTMLButtonElement | null)?.click();

    for (const link of await screen.baseElement.querySelectorAll('ul a')) {
      await (link as HTMLAnchorElement).click();
      await expect(screen.baseElement.querySelector('#test')).toHaveTextContent(`${link.textContent} Clicked`);
    }
  });
});
