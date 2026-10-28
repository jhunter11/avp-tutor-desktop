import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import CodePane from '../../../app/components/panes/CodePane';

function Test() {
  return (
    <CodePane
      src="test"
      setSrc={() => {}}
      highlight={1}
      editing={false}
      setEditing={(_: boolean) => {}}
      save={() => {}}
      discard={() => {}}
    />
  );
};

// NOTE: All tests in this section must be combined into one, due to a
//       long-standing bug in Monaco that causes concurrent async
//       instances to crash each other.
// See https://github.com/microsoft/monaco-editor/issues/4702
//
// Additionally, Monaco will not properly render in a headless
// browser, so these tests are relatively trivial.
describe('Test component: <CodePane />', async () => {
  test('Ensure component is rendered properly', async () => {
    const screen = await render(<Test />);

    // Ensure editor name is properly applied
    await expect(screen.baseElement.querySelector('#code')).toBeInTheDocument();

    // Ensure editor HTML and JS loads
    await expect(screen.getByText('Loading...')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('script[src*="monaco-editor"]')).toBeInTheDocument();

    // Cannot test more than this due to Monaco's limitations
  });
});
