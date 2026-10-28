import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import FlexSpacer from '../../app/components/FlexSpacer';

function Test() {
  return (
    <FlexSpacer />
  );
};

describe('Test component: <FlexSpacer />', async () => {
  test('Ensure component is rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('div[role="presentation"]')).toBeInTheDocument();
  });
});
