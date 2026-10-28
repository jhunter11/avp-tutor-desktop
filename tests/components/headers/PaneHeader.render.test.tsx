import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import PaneHeader from '../../../app/components/headers/PaneHeader';

function Test() {
  const [editing, setEditing] = useState(false as boolean | undefined);
  const [saveState, setSaveState] = useState('none');
  const [paneHeight, setPaneHeight] = useState(100);

  return (
    <>
      <PaneHeader
        title="Test"
        editing={editing}
        setEditing={setEditing}
        save={
          () => {
            setSaveState('saved');
          }
        }
        discard={
          () => {
            setSaveState('discarded');
          }
        }
        paneHeight={paneHeight}
        setPaneHeight={setPaneHeight}
        defaultPaneHeight={100}
        minPaneHeight={1}
      />
      <p id="test">{saveState}</p>
      <p id="height">{paneHeight}</p>
      <button id="disable-editing" onClick={() => setEditing(undefined)}>Disable Editing</button>
    </>
  );
};

describe('Test component: <PaneHeader />', async () => {
  test('Ensure title is rendered properly', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('h3')).toHaveTextContent('Test');
  });

  test('Ensure arrow is rendered properly', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('button[title="Collapse Test Pane"]')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Collapse Test Pane"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('button[title="Expand Test Pane"]')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Expand Test Pane"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('button[title="Collapse Test Pane"]')).toBeInTheDocument();
  });

  test('Ensure arrow properly updates pane height', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('button[title="Collapse Test Pane"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#height')).toHaveTextContent('1');

    await (screen.baseElement.querySelector('button[title="Expand Test Pane"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#height')).toHaveTextContent('100');
  });

  test('Ensure edit button is rendered properly', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('button[title="Edit Test"]')).toBeInTheDocument();
  });

  test('Ensure save and discard buttons are rendered properly', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('button[title="Edit Test"]') as HTMLButtonElement | null)?.click();

    await expect(screen.baseElement.querySelector('button[title="Save changes"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Discard changes"]')).toBeInTheDocument();
  });

  test('Ensure save button properly updates state', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#test')).toHaveTextContent('none');

    await (screen.baseElement.querySelector('button[title="Edit Test"]') as HTMLButtonElement | null)?.click();
    await (screen.baseElement.querySelector('button[title="Save changes"]') as HTMLButtonElement | null)?.click();

    await expect(screen.baseElement.querySelector('#test')).toHaveTextContent('saved');
  });

  test('Ensure discard button properly updates state', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#test')).toHaveTextContent('none');

    await (screen.baseElement.querySelector('button[title="Edit Test"]') as HTMLButtonElement | null)?.click();
    await (screen.baseElement.querySelector('button[title="Discard changes"]') as HTMLButtonElement | null)?.click();

    await expect(screen.baseElement.querySelector('#test')).toHaveTextContent('discarded');
  });

  test('Ensure edit/save/discard buttons are not rendered when editing is undefined', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('#disable-editing') as HTMLButtonElement | null)?.click();

    await expect(screen.baseElement.querySelector('button[title="Edit Test"]')).not.toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Save changes"]')).not.toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Discard changes"]')).not.toBeInTheDocument();
  });
});
