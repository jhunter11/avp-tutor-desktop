import { type Step } from '../../types';

import VisFrame from '../visualization/VisFrame';
import VisBuilder from '../visualization/VisBuilder';

/**
 * Renders the visualization pane for the visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {number} props.numSteps
 *        The number of steps in the visualization
 * @param {number} props.stepNum
 *        The current step number
 * @param {Step} props.stepDat
 *        The current step data
 * @param {function} props.prevStep
 *        A function to go to the previous step
 * @param {function} props.nextStep
 *        A function to go to the next step
 * @param {function} props.setStepNum
 *        A function to update the step number directly
 * @param {function} props.reset
 *        A function to reset the visualization
 */
export default function VisPane(
  {
    numSteps,
    stepNum,
    stepDat,
    prevStep,
    nextStep,
    setStepNum,
    reset,
  }:
  {
    numSteps: number
    stepNum: number
    stepDat: Step
    prevStep: () => void
    nextStep: () => void
    setStepNum: (num: number) => void
    reset: () => void
  },
) {
  return (
    <VisFrame
      numSteps={numSteps}
      stepNum={stepNum}
      prevStep={prevStep}
      nextStep={nextStep}
      setStepNum={setStepNum}
      reset={reset}
    >
      <VisBuilder
        stepDat={stepDat}
        stepNum={stepNum}
      />
    </VisFrame>
  );
}
