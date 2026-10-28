import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit toggle and height states of sidebar panes.
 */
export default function useSidebarPanes() {
  // Warning: If you have to fix a bug in this hook, I am so so sorry.

  const [codePaneHeight, _setCodePaneHeight] = useState(null as number | null);
  const [varsPaneHeight, _setVarsPaneHeight] = useState(null as number | null);
  const [AIPaneHeight, _setAIPaneHeight] = useState(null as number | null);
  const [defaultPaneHeight, setDefaultPaneHeight] = useState(0);
  const [maxPaneHeight, setMaxPaneHeight] = useState(0);

  const minPaneHeight = 42;

  // This variable needs a bit of explanation - essentially, it keeps track of
  // whether the parent of this hook has re-rendered since the last call to one
  // of the setHeight functions.
  // On each re-render, this code will run, setting the variable to true. Thus,
  // if any of the setHeight functions is called, this variable will be set to
  // false, but only until the next re-render.
  // On resize, the setHeight functions will be called faster than React can
  // re-render, so this will be false. On collapse/expand, the setHeight
  // functions will only be called once, triggering an immediate re-render, and
  // this will be true.
  // Thus, this variable serves as an indicator of whether the pane is being
  // resized (if false) or expanded/collapsed (if true).
  let hasRerendered = true;

  function updateDefaults() {
    setDefaultPaneHeight(document.body.querySelector('main')!.clientHeight / 3);
    setMaxPaneHeight(document.body.querySelector('main')!.clientHeight);
  }

  function clamp(value: number, min = minPaneHeight, max = maxPaneHeight) {
    return Math.min(Math.max(value, min), max);
  }

  function setCodePaneHeight(height: number) {
    const diff = height - (codePaneHeight || 0);

    const AINew = (AIPaneHeight || 0) - diff;
    const varsNew = (varsPaneHeight || 0) - diff;

    const AIDiff = clamp(AINew - minPaneHeight, -Infinity, 0);
    const varsDiff = clamp(varsNew - minPaneHeight, -Infinity, 0);

    if (height === minPaneHeight && hasRerendered) {
      // We are collapsing the code pane
      if (varsPaneHeight === minPaneHeight && AIPaneHeight !== minPaneHeight) {
        _setAIPaneHeight(clamp(AINew));
        _setCodePaneHeight(height);
      } else {
        _setVarsPaneHeight(clamp(varsNew));
        _setCodePaneHeight(height);
      }
    } else {
      // We are expanding the code pane
      if (varsPaneHeight === minPaneHeight) {
        _setAIPaneHeight(clamp(AINew));
        _setCodePaneHeight(height);
      } else if (AIPaneHeight === minPaneHeight) {
        _setVarsPaneHeight(clamp(varsNew));
        _setCodePaneHeight(height);
      } else if (
        Math.max(AIPaneHeight || 0, varsPaneHeight || 0) === AIPaneHeight
      ) {
        _setAIPaneHeight(clamp(AINew));
        _setVarsPaneHeight((varsPaneHeight || 0) + AIDiff);
        _setCodePaneHeight(height);
      } else {
        _setVarsPaneHeight(clamp(varsNew));
        _setAIPaneHeight((AIPaneHeight || 0) + varsDiff);
        _setCodePaneHeight(height);
      }
    }
    hasRerendered = false;
  }

  function setVarsPaneHeight(height: number) {
    const diff = height - (varsPaneHeight || 0);

    const AINew = (AIPaneHeight || 0) - diff;
    const codeNew = (codePaneHeight || 0) - diff;

    const AIDiff = clamp(AINew - minPaneHeight, -Infinity, 0);
    const codeDiff = clamp(codeNew - minPaneHeight, -Infinity, 0);

    if (height === minPaneHeight && hasRerendered) {
      // We are collapsing the vars pane
      if (AIPaneHeight === minPaneHeight && codePaneHeight !== minPaneHeight) {
        _setCodePaneHeight(clamp(codeNew));
        _setVarsPaneHeight(height);
      } else {
        _setAIPaneHeight(clamp(AINew));
        _setVarsPaneHeight(height);
      }
    } else if (
      ((varsPaneHeight || 0) === minPaneHeight) &&
      (height === defaultPaneHeight)
    ) {
      // We are expanding the vars pane
      if (AIPaneHeight === minPaneHeight) {
        _setCodePaneHeight(clamp(codeNew));
        _setVarsPaneHeight(height);
      } else if (codePaneHeight === minPaneHeight) {
        _setAIPaneHeight(clamp(AINew));
        _setVarsPaneHeight(height);
      } else if (
        Math.max(AIPaneHeight || 0, codePaneHeight || 0) === AIPaneHeight
      ) {
        _setAIPaneHeight(clamp(AINew));
        _setCodePaneHeight((codePaneHeight || 0) + AIDiff);
        _setVarsPaneHeight(height);
      } else {
        _setCodePaneHeight(clamp(codeNew));
        _setAIPaneHeight((AIPaneHeight || 0) + codeDiff);
        _setVarsPaneHeight(height);
      }
    } else {
      // We are resizing the vars pane
      _setCodePaneHeight(clamp(codeNew));
      _setVarsPaneHeight(height + codeDiff);
    }
    hasRerendered = false;
  }

  function setAIPaneHeight(height: number) {
    const diff = height - (AIPaneHeight || 0);

    const codeNew = (codePaneHeight || 0) - diff;
    const varsNew = (varsPaneHeight || 0) - diff;

    const codeDiff = clamp(codeNew - minPaneHeight, -Infinity, 0);
    const varsDiff = clamp(varsNew - minPaneHeight, -Infinity, 0);

    if (height === minPaneHeight && hasRerendered) {
      // We are collapsing the AI pane
      if (varsPaneHeight === minPaneHeight) {
        _setCodePaneHeight(clamp(codeNew));
        _setAIPaneHeight(height);
      } else {
        _setVarsPaneHeight(clamp(varsNew));
        _setAIPaneHeight(height);
      }
    } else if (
      ((AIPaneHeight || 0) === minPaneHeight) &&
      (height === defaultPaneHeight)
    ) {
      // We are expanding the AI pane
      if (varsPaneHeight === minPaneHeight) {
        _setCodePaneHeight(clamp(codeNew));
        _setAIPaneHeight(height);
      } else if (codePaneHeight === minPaneHeight) {
        _setVarsPaneHeight(clamp(varsNew));
        _setAIPaneHeight(height);
      } else if (
        Math.max(varsPaneHeight || 0, codePaneHeight || 0) === varsPaneHeight
      ) {
        _setVarsPaneHeight(clamp(varsNew));
        _setCodePaneHeight((codePaneHeight || 0) + varsDiff);
        _setAIPaneHeight(height);
      } else {
        _setCodePaneHeight(clamp(codeNew));
        _setVarsPaneHeight((varsPaneHeight || 0) + codeDiff);
        _setAIPaneHeight(height);
      }
    } else {
      // We are resizing the AI pane
      _setVarsPaneHeight(clamp(varsNew));
      _setAIPaneHeight(height + varsDiff);
    }
    hasRerendered = false;
  }

  useEffect(() => {
    if (defaultPaneHeight === 0) return;

    _setCodePaneHeight(
      clamp(
        parseInt(
          localStorage.getItem('codePaneHeight') || '0',
        ) || defaultPaneHeight,
      ),
    );

    _setVarsPaneHeight(
      clamp(
        parseInt(
          localStorage.getItem('varsPaneHeight') || '0',
        ) || defaultPaneHeight,
      ),
    );

    _setAIPaneHeight(
      clamp(
        parseInt(
          localStorage.getItem('AIPaneHeight') || '0',
        ) || defaultPaneHeight,
      ),
    );

    const diff = maxPaneHeight - varsPaneHeight! -
      codePaneHeight! - AIPaneHeight!;
    if (diff > 0) {
      _setAIPaneHeight(AIPaneHeight! + (diff / 3));
      _setVarsPaneHeight(varsPaneHeight! + (diff / 3));
      _setCodePaneHeight(codePaneHeight! + (diff / 3));
    }
  }, [defaultPaneHeight, maxPaneHeight]);

  useEffect(() => {
    if (codePaneHeight === null) return;
    localStorage.setItem('codePaneHeight', codePaneHeight.toString());
  }, [codePaneHeight]);

  useEffect(() => {
    if (varsPaneHeight === null) return;

    localStorage.setItem('varsPaneHeight', varsPaneHeight.toString());
  }, [varsPaneHeight]);

  useEffect(() => {
    if (AIPaneHeight === null) return;

    localStorage.setItem('AIPaneHeight', AIPaneHeight.toString());
  }, [AIPaneHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateDefaults);
    updateDefaults();
  }, []);

  return [
    codePaneHeight,
    setCodePaneHeight,
    varsPaneHeight,
    setVarsPaneHeight,
    AIPaneHeight,
    setAIPaneHeight,
    defaultPaneHeight,
    minPaneHeight,
    maxPaneHeight,
  ] as const;
}
