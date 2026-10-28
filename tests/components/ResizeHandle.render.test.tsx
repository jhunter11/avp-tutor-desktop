import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import ResizeHandle from '../../app/components/ResizeHandle';

describe('Test component: <ResizeHandle />', async () => {
  test('Ensure handle renders properly in top position', async () => {
    const screen = await render(
      <ResizeHandle
        position="top"
        size={100}
        otherSize={100}
        setSize={() => {}}
        defaultSize={100}
        minSize={100}
        maxSize={100}
      />,
    );

    await expect(screen.baseElement.querySelector('div[class*="cursor-ns-resize"]')).toBeInTheDocument();
  });

  test('Ensure handle renders properly in left position', async () => {
    const screen = await render(
      <ResizeHandle
        position="left"
        size={100}
        otherSize={100}
        setSize={() => {}}
        defaultSize={100}
        minSize={100}
        maxSize={100}
      />,
    );

    await expect(screen.baseElement.querySelector('div[class*="cursor-ew-resize"]')).toBeInTheDocument();
  });
});
