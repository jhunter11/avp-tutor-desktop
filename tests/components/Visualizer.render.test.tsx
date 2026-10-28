import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import Visualizer from '../../app/components/Visualizer';

function Test() {
  return (
    <main>
      <Visualizer
        sidebar={true}
        setSidebar={() => {}}
        sidebarDefaultWidth={100}
        sidebarMinWidth={100}
        sidebarMaxWidth={100}
        sidebarWidth={100}
        setSidebarWidth={() => {}}
        setTitle={() => {}}
      />
    </main>
  );
};

// NOTE: All tests in this section must be combined into one, due to a
//       long-standing bug in Monaco that causes concurrent async
//       instances to crash each other.
// See https://github.com/microsoft/monaco-editor/issues/4702
describe('Test component: <Visualizer />', async () => {
  test('Ensure all panes are rendered', async () => {
    const screen = await render(<Test />);

    // Loader
    await expect(screen.baseElement.querySelector('h1')).toHaveTextContent('Loading...');

    // Visualizer
    await expect(screen.baseElement.querySelector('button[title="Step Backward"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Step Forward"]')).toBeInTheDocument();

    // Code
    await expect(screen.baseElement.querySelector('#code')).toBeInTheDocument();

    // Vars
    await expect(screen.baseElement.querySelector('#vars')).toBeInTheDocument();

    // TODO: AI
  });
});
