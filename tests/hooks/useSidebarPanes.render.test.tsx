import { render } from 'vitest-browser-react';
import { expect, test, describe, beforeEach } from 'vitest';

import useSidebarPanes from '../../app/hooks/useSidebarPanes';

function Test() {
  const [
    codePaneHeight,
    setCodePaneHeight,
    varsPaneHeight,
    setVarsPaneHeight,
    AIPaneHeight,
    setAIPaneHeight,
    defaultPaneHeight,
    minPaneHeight,
    maxPaneHeight,
  ] = useSidebarPanes();

  return (
    <main style={{ height: '216px', padding: '0', margin: '0' }}>
      <p id="code">{codePaneHeight}</p>
      <p id="vars">{varsPaneHeight}</p>
      <p id="ai">{AIPaneHeight}</p>

      <p id="default">{defaultPaneHeight}</p>
      <p id="min">{minPaneHeight}</p>
      <p id="max">{maxPaneHeight}</p>

      <button onClick={() => setCodePaneHeight(minPaneHeight)}>
        Collapse Code
      </button>
      <button onClick={() => setVarsPaneHeight(minPaneHeight)}>
        Collapse Vars
      </button>
      <button onClick={() => setAIPaneHeight(minPaneHeight)}>
        Collapse AI
      </button>

      <button onClick={() => setCodePaneHeight(defaultPaneHeight)}>
        Expand Code
      </button>
      <button onClick={() => setVarsPaneHeight(defaultPaneHeight)}>
        Expand Vars
      </button>
      <button onClick={() => setAIPaneHeight(defaultPaneHeight)}>
        Expand AI
      </button>
    </main>
  );
};

describe('Test hook: useSidebarPanes()', async () => {
  beforeEach(() => {
    localStorage.clear(); // Ensure values are consistent
  });

  test('Ensure default values are appropriate', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#default')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#min')).toHaveTextContent('42');
    await expect(screen.baseElement.querySelector('#max')).toHaveTextContent('216');
  });

  test('Ensure code pane works as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('codePaneHeight')).toBe('72');

    await screen.getByText('Collapse Code').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('42');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('102');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('codePaneHeight')).toBe('42');

    await screen.getByText('Expand Code').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('codePaneHeight')).toBe('72');
  });

  test('Ensure vars pane works as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('varsPaneHeight')).toBe('72');

    await screen.getByText('Collapse Vars').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('42');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('102');
    await expect(localStorage.getItem('varsPaneHeight')).toBe('42');

    await screen.getByText('Expand Vars').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('varsPaneHeight')).toBe('72');
  });

  test('Ensure AI pane works as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('AIPaneHeight')).toBe('72');

    await screen.getByText('Collapse AI').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('102');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('42');
    await expect(localStorage.getItem('AIPaneHeight')).toBe('42');

    await screen.getByText('Expand AI').click();
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('72');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('72');
    await expect(localStorage.getItem('AIPaneHeight')).toBe('72');
  });
});
