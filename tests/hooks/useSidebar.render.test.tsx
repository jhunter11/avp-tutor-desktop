import { render } from 'vitest-browser-react';
import { expect, test, describe, beforeEach } from 'vitest';

import useSidebar from '../../app/hooks/useSidebar';

function Test() {
  const [
    sidebar,
    setSidebar,
    sidebarDefaultWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    sidebarWidth,
    setSidebarWidth,
  ] = useSidebar();

  return (
    <main style={{ width: '216px', padding: '0', margin: '0' }}>
      <p id="sidebar">{sidebar}</p>
      <p id="default">{sidebarDefaultWidth}</p>
      <p id="min">{sidebarMinWidth}</p>
      <p id="max">{sidebarMaxWidth}</p>
      <p id="width">{sidebarWidth}</p>

      <button onClick={() => setSidebar(!sidebar)}>Toggle Sidebar</button>
      <button onClick={() => setSidebarWidth(sidebarMaxWidth - 10)}>
        Set Width
      </button>
    </main>
  );
};

describe('Test hook: useSidebar()', async () => {
  beforeEach(() => {
    localStorage.clear(); // Ensure values are consistent
  });

  test('Ensure resize values are appropriate', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#default')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#min')).toHaveTextContent('36');
    await expect(screen.baseElement.querySelector('#max')).toHaveTextContent('162');
  });

  test('Ensure width is updated as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#width')).toHaveTextContent('72');
    await expect(localStorage.getItem('sidebarWidth')).toBe('72');

    await screen.getByText('Set Width').click();

    await expect(screen.baseElement.querySelector('#width')).toHaveTextContent('152');
    await expect(localStorage.getItem('sidebarWidth')).toBe('152');
  });

  test('Ensure sidebar is updated as expected', async () => {
    const screen = await render(<Test />);

    await expect(localStorage.getItem('sidebar')).toBe('true');

    await screen.getByText('Toggle Sidebar').click();

    await expect(localStorage.getItem('sidebar')).toBe('false');
  });
});
