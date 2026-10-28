import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import VisFrame from '../../../app/components/visualization/VisFrame';

function Test() {
  const [stepNum, setStepNum] = useState(3);

  return (
    <VisFrame
      numSteps={5}
      stepNum={stepNum}
      prevStep={() => setStepNum(stepNum - 1)}
      nextStep={() => setStepNum(stepNum + 1)}
      setStepNum={setStepNum}
      reset={() => setStepNum(0)}
    >
      <h1>Test Header</h1>
      <p>Test Text</p>
    </VisFrame>
  );
};

describe('Test component: <VisFrame />', async () => {
  test('Ensure child elements are rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Test Header')).toBeInTheDocument();
    await expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  test('Ensure step buttons are rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('button[title="Step Backward"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Step Forward"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Play Animation"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Reset"]')).toBeInTheDocument();
  });

  test('Ensure speed buttons are rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('button[title="Decrease Speed"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Increase Speed"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Reset Speed"]')).toBeInTheDocument();
  });

  test('Ensure zoom buttons are rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('button[title="Zoom In"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Zoom Out"]')).toBeInTheDocument();
    await expect(screen.baseElement.querySelector('button[title="Reset Zoom"]')).toBeInTheDocument();
  });

  test('Ensure step and zoom states are properly displayed', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Step: 3 / 5')).toBeInTheDocument();
    await expect(screen.getByText('Speed: 1x')).toBeInTheDocument();
    await expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
  });

  test('Ensure step buttons work', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Step: 3 / 5')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Step Backward"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Step: 2 / 5')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Step Forward"]') as HTMLButtonElement).click();
    await (screen.baseElement.querySelector('button[title="Step Forward"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Step: 4 / 5')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Reset"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Step: 0 / 5')).toBeInTheDocument();
  });

  test('Ensure speed buttons work', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Speed: 1x')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Decrease Speed"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Speed: 0.9x')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Increase Speed"]') as HTMLButtonElement).click();
    await (screen.baseElement.querySelector('button[title="Increase Speed"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Speed: 1.1x')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Reset Speed"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Speed: 1x')).toBeInTheDocument();
  });

  test('Ensure zoom buttons work', async () => {
    const screen = await render(<Test />);

    await expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Zoom In"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Zoom: 110%')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Zoom Out"]') as HTMLButtonElement).click();
    await (screen.baseElement.querySelector('button[title="Zoom Out"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Zoom: 90%')).toBeInTheDocument();

    await (screen.baseElement.querySelector('button[title="Reset Zoom"]') as HTMLButtonElement).click();
    await expect(screen.getByText('Zoom: 100%')).toBeInTheDocument();
  });
});
