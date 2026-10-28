import {
  useEffect,
  useState,
} from 'react';

import { type Step } from '../types';

let stepNumJS = 0;

/**
 * Provides a hook to load, read, and update step data.
 *
 * @param {Object} props
 *        React props
 * @param {Step[]} props.comp
 *        An array of step data
 */
export default function useSteps(
  {
    comp,
  }:
  {
    comp: Step[]
  },
) {
  const [vars, setVars] = useState({} as { [key: string]: [any, number] });
  const [lines, setLines] = useState(null as number | [number, number] | null);

  const [numSteps, setNumSteps] = useState(0);
  const [stepNum, _setStepNum] = useState(0);

  const [deltaNum, setDeltaNum] = useState(0);

  const [stepDat, setStepDat] = useState({} as Step);
  const [varHistory, setVarHistory] = useState(
    [] as { [key: string]: [any, number] }[],
  );

  useEffect(() => {
    setVars({} as { [key: string]: [any, number] });
    setLines(null);
    setNumSteps(Object.keys(comp).length);
    _setStepNum(0);
    setStepDat({} as Step);
  }, [comp]);

  useEffect(() => {
    if (deltaNum > 0) {
      nextStep();
      setDeltaNum(deltaNum - 1);
    } else if (deltaNum < 0) {
      prevStep();
      setDeltaNum(deltaNum + 1);
    }
  }, [deltaNum]);

  useEffect(() => {
    stepNumJS = stepNum;
  }, [stepNum]);

  function nextStep() {
    if (stepNum >= numSteps) return;

    const newStepNum = stepNum + 1;
    _setStepNum(newStepNum);

    if (newStepNum <= 0 || newStepNum > numSteps) {
      setStepDat({} as Step);
      setLines(null);
      setVars({} as { [key: string]: [any, number] });
      return;
    }

    const step = comp[newStepNum - 1];
    setStepDat(step);
    setLines(step.line);

    const temp_vars = JSON.parse(JSON.stringify(vars));
    for (const action of step.actions) {
      switch (action.cmd) {
        case 'var_add':
          if (action.params.name in temp_vars) {
            temp_vars[action.params.name][0] = action.params.value;
          } else {
            temp_vars[action.params.name] = [
              action.params.value,
              0,
            ];
          }
          break;

        case 'var_delete':
          if (temp_vars[action.params.name])
            delete temp_vars[action.params.name];
          break;

        case 'var_highlight':
          if (temp_vars[action.params.name])
            temp_vars[action.params.name][1] = 1;
          break;

        case 'var_greyout':
          if (temp_vars[action.params.name])
            temp_vars[action.params.name][1] = -1;
          break;

        case 'var_normal':
          if (temp_vars[action.params.name])
            temp_vars[action.params.name][1] = 0;
          break;

        default:
          break;
      }
    }

    setVars(temp_vars);
    setVarHistory([...varHistory, JSON.parse(JSON.stringify(temp_vars))]);
  }

  function prevStep() {
    if (stepNum <= 0) return;

    const newStepNum = stepNum - 1;
    _setStepNum(newStepNum);

    if (newStepNum <= 0 || newStepNum > numSteps) {
      setStepDat({} as Step);
      setLines(null);
      setVars({} as { [key: string]: [any, number] });
      return;
    }

    const step = comp[newStepNum - 1];
    setStepDat(step);
    setLines(step.line);

    setVars(varHistory[varHistory.length - 2]);
    setVarHistory(varHistory.slice(0, varHistory.length - 1));
  }

  function setStepNum(num: number) {
    if (num < 0 || num > numSteps || deltaNum !== 0) return;
    setDeltaNum(num - stepNumJS);
    stepNumJS = num;
  }

  function reset() {
    _setStepNum(0);
    setStepDat({} as Step);
    setLines(null);
    setVars({} as { [key: string]: [any, number] });
    setVarHistory([]);
  }

  return [
    vars,
    lines,
    numSteps,
    nextStep,
    prevStep,
    reset,
    stepNum,
    setStepNum,
    stepDat,
  ] as const;
}
