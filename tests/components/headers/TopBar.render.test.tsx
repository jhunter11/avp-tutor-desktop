import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import {
  useRef,
  useState,
} from 'react';

import TopBar from '../../../app/components/headers/TopBar';

function Test() {
  const [mutable, setMutable] = useState(false);
  const [title, setTitle] = useState('Title');
  const [sidebar, setSidebar] = useState(false as boolean | null | undefined);

  const menuTrigger = useRef({} as HTMLElement);
  const menuPanel = useRef({} as HTMLElement);

  return (
    <>
      <TopBar
        title={title}
        setTitle={setTitle}
        mutable={mutable}
        sidebar={sidebar}
        setSidebar={setSidebar}
        menuTrigger={menuTrigger}
        menuPanel={menuPanel}
      />

      <p id="title">{title}</p>
      <p id="sidebar">{((sidebar === null) ? true : sidebar) ? 'true' : 'false'}</p>

      <button id="toggle-mutable" onClick={() => setMutable(!mutable)}>Toggle Mutable</button>
      <button id="new-title" onClick={() => setTitle('New Title')}>New Title</button>
      <button id="remove-sidebar" onClick={() => setSidebar(undefined)}>Remove Sidebar</button>
    </>
  );
};

describe('Test component: <TopBar />', async () => {
  test('Ensure title is rendered when immutable', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('Title');
  });

  test('Ensure title is rendered when mutable', async () => {
    const screen = await render(<Test />);
    await (screen.baseElement.querySelector('#toggle-mutable') as HTMLButtonElement | null)?.click();

    await expect(screen.baseElement.querySelector('pre')).toHaveTextContent('Title');
  });

  test('Ensure title updates with setTitle when mutable', async () => {
    const screen = await render(<Test />);
    await (screen.baseElement.querySelector('#toggle-mutable') as HTMLButtonElement | null)?.click();

    await (screen.baseElement.querySelector('#new-title') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('pre')).toHaveTextContent('New Title');
  });

  test('Ensure title width dynamically matches text content when mutable', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('input[type="text"]')?.getBoundingClientRect().width)
      .toBe(screen.baseElement.querySelector('pre')?.getBoundingClientRect().width);

    await (screen.baseElement.querySelector('#new-title') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('input[type="text"]')?.getBoundingClientRect().width)
      .toBe(screen.baseElement.querySelector('pre')?.getBoundingClientRect().width);
  });

  test('Ensure sidebar toggle updates sidebar state', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('button[aria-label="Toggle Sidebar"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#sidebar')).toHaveTextContent('true');

    await (screen.baseElement.querySelector('button[aria-label="Toggle Sidebar"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#sidebar')).toHaveTextContent('false');
  });

  test('Ensure sidebar toggle only exists when sidebar is defined', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('#remove-sidebar') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('button[aria-label="Toggle Sidebar"]')).not.toBeInTheDocument();
  });
});
