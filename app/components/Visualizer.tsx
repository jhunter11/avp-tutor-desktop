import {
  useContext,
  useEffect,
  useState,
} from 'react';

import VisualizerLayout from './frames/VisualizerLayout';

import VisPane from './panes/VisPane';
import CodePane from './panes/CodePane';
import VarsPane from './panes/VarsPane';
import AIPane from './panes/AIPane';

import Loader from './Loader';

import useAlgo from '../hooks/useAlgo';
import useSidebarPanes from '../hooks/useSidebarPanes';
import useSteps from '../hooks/useSteps';
import useEditSrc from '../hooks/useEditSrc';

import ModifiedContext from '../contexts/ModifiedContext';

/**
 * Renders a visualizer complete with collapsible sidebar. Includes animation,
 * code tracing, variables, and [TODO] AI panes.
 *
 * @param {Object} props
 *        React props
 * @param {boolean | null} props.sidebar
 *        Whether the sidebar is toggled
 * @param {function} props.setSidebar
 *        A function to update the sidebar state
 * @param {number} props.sidebarDefaultWidth
 *        The default width in px of the sidebar
 * @param {number} props.sidebarMinWidth
 *        The minimum width in px of the sidebar
 * @param {number} props.sidebarMaxWidth
 *        The maximum width in px of the sidebar
 * @param {number | null} props.sidebarWidth
 *        The current width in px of the sidebar
 * @param {function} props.setSidebarWidth
 *        A function to update the width of the sidebar
 * @param {function} props.setTitle
 *        A function to update the header title
 */
export default function Visualizer(
  {
    sidebar,
    setSidebar,
    sidebarDefaultWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    sidebarWidth,
    setSidebarWidth,
    setTitle,
  }:
  {
    sidebar: boolean | null | undefined
    setSidebar: (value: boolean | null | undefined) => void
    sidebarDefaultWidth: number
    sidebarMinWidth: number
    sidebarMaxWidth: number
    sidebarWidth: number | null
    setSidebarWidth: (width: number | null) => void
    setTitle: ((value: string) => void)
  },
) {
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [editing, setEditing] = useState(false);

  const [modified, setModified] = useContext(ModifiedContext);

  const [
    src,
    setSrc,
    comp,
  ] = useAlgo({ setTitle, setLoaderHidden });

  const [
    vars,
    lines,
    numSteps,
    nextStep,
    prevStep,
    reset,
    stepNum,
    setStepNum,
    stepDat,
  ] = useSteps({ comp });

  const [
    codePaneHeight,
    setCodePaneHeight,
    varsPaneHeight,
    setVarsPaneHeight,
    AIPaneHeight,
    setAIPaneHeight,
    defaultPaneHeight,
    minPaneHeight,
    maxPaneHeight,
  ] = useSidebarPanes();

  const [
    editSrc,
    setEditSrc,
    save,
    discard,
  ] = useEditSrc({
    src,
    setSrc,
    onSave: () => {
      setEditing(false);
      setModified((modified || 0) + 1);
    },
    onDiscard: () => setEditing(false),
  });

  const [executedSource, setExecutedSource] = useState(src);
  useEffect(() => setExecutedSource(src), [comp]);

  return (
    <>
      <Loader hidden={loaderHidden} />
      <VisualizerLayout
        editing={editing}
        setEditing={setEditing}
        save={save}
        discard={discard}
        sidebar={sidebar}
        setSidebar={setSidebar}
        sidebarDefaultWidth={sidebarDefaultWidth}
        sidebarMinWidth={sidebarMinWidth}
        sidebarMaxWidth={sidebarMaxWidth}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
        codePaneHeight={codePaneHeight}
        setCodePaneHeight={setCodePaneHeight}
        varsPaneHeight={varsPaneHeight}
        setVarsPaneHeight={setVarsPaneHeight}
        AIPaneHeight={AIPaneHeight}
        setAIPaneHeight={setAIPaneHeight}
        defaultPaneHeight={defaultPaneHeight}
        minPaneHeight={minPaneHeight}
        maxPaneHeight={maxPaneHeight}
      >
        <VisPane
          numSteps={numSteps}
          stepNum={stepNum}
          stepDat={stepDat}
          prevStep={prevStep}
          nextStep={nextStep}
          setStepNum={setStepNum}
          reset={reset}
        />
        <CodePane
          src={editSrc}
          setSrc={setEditSrc}
          highlight={lines}
          editing={editing}
          setEditing={setEditing}
          save={save}
          discard={discard}
        />
        <VarsPane vars={vars} />
        <AIPane
          context={{
            algorithm: typeof document === 'undefined' ?
              'Current algorithm' :
              (document.getElementById('title') as HTMLInputElement | null)?.value ||
              document.getElementById('title')?.textContent || 'Current algorithm',
            student_code: editSrc,
            executed_code: executedSource,
            viewed_state: {
              step: stepNum,
              total_steps: numSteps,
              highlighted_lines: lines,
              variables: vars,
              last_step: stepDat,
              code_matches_execution: editSrc === executedSource,
            },
          }}
        />
      </VisualizerLayout>
    </>
  );
}
