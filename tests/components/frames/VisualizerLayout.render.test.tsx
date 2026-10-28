import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import VisualizerLayout from '../../../app/components/frames/VisualizerLayout';

function Test() {
  const [editing, setEditing] = useState(false);
  const [sidebar, setSidebar] = useState(false as boolean | null | undefined);
  const [sidebarWidth, setSidebarWidth] = useState(100 as number | null);
  const [codePaneHeight, setCodePaneHeight] = useState(10 as number | null);
  const [varsPaneHeight, setVarsPaneHeight] = useState(20 as number | null);
  const [AIPaneHeight, setAIPaneHeight] = useState(30 as number | null);

  return (
    <VisualizerLayout
      editing={editing}
      setEditing={setEditing}
      save={() => {}}
      discard={() => {}}
      sidebar={sidebar}
      setSidebar={setSidebar}
      sidebarDefaultWidth={100}
      sidebarMinWidth={1}
      sidebarMaxWidth={200}
      sidebarWidth={sidebarWidth}
      setSidebarWidth={setSidebarWidth}
      codePaneHeight={codePaneHeight}
      setCodePaneHeight={setCodePaneHeight}
      varsPaneHeight={varsPaneHeight}
      setVarsPaneHeight={setVarsPaneHeight}
      AIPaneHeight={AIPaneHeight}
      setAIPaneHeight={setAIPaneHeight}
      defaultPaneHeight={20}
      minPaneHeight={1}
      maxPaneHeight={50}
    >
      <p id="vis">Vis Pane Test</p>
      <p id="code">Code Pane Test</p>
      <p id="vars">Vars Pane Test</p>
      <p id="ai">AI Pane Test</p>
    </VisualizerLayout>
  );
};

describe('Test component: <VisualizerLayout />', async () => {
  test('Ensure child elements exist', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#vis')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('#code')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('#vars')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('#ai')).toBeInTheDocument();
  });

  test('Ensure child elements render properly', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#vis')).toHaveTextContent('Vis Pane Test');
    await expect(screen.baseElement.querySelector('#code')).toHaveTextContent('Code Pane Test');
    await expect(screen.baseElement.querySelector('#vars')).toHaveTextContent('Vars Pane Test');
    await expect(screen.baseElement.querySelector('#ai')).toHaveTextContent('AI Pane Test');
  });
});
