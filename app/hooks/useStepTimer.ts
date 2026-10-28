import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to time step transitions in the visualization.
 *
 * @param {Object} props
 *        React props
 * @param {number | null} props.speed
 *        The current speed of the visualization
 * @param {number} props.numSteps
 *        The number of steps in the visualization
 * @param {number} props.stepNum
 *        The current step number
 * @param {function} props.nextStep
 *        A function to go to the next step
 */
export default function useStepTimer({
  speed,
  numSteps,
  stepNum,
  nextStep,
}: {
  speed: number | null
  numSteps: number
  stepNum: number
  nextStep: () => void
}) {
  const TICK_SPEED = 10; // In ms

  const [time, setTime] = useState(0);
  const [step, setStep] = useState(false);
  const [timeStep, setTimeStep] = useState(null as NodeJS.Timeout | null);

  useEffect(() => {
    if (speed === null) return;

    if (time > 0) {
      if ((time - TICK_SPEED) %
        (Math.round(speed / TICK_SPEED) * TICK_SPEED) === 0
      ) {
        setStep(true);
      }

      setTimeStep(
        setTimeout(() => setTime(time + TICK_SPEED), TICK_SPEED),
      );
    } else {
      if (timeStep) {
        clearTimeout(timeStep);
        setStep(false);
      }
    }
  }, [time]);

  useEffect(() => {
    if (step) {
      if (stepNum === numSteps) {
        setTime(0);
        return;
      }

      nextStep();
      setStep(false);
    }
  }, [step]);

  return [
    time,
    setTime,
    TICK_SPEED,
  ] as const;
}
