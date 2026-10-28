import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

function Test() {
  return (
    <>
    </>
  );
};

describe('Test component: <VisBuilder />', async () => {
  test.todo('TODO', async () => {
    const screen = await render(<Test />);

    await expect(screen).not.toBeNull();
  });
});
