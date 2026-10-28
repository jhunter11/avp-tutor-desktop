import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { Editor } from '@monaco-editor/react';

import Defs from '../defs';

import DarkModeContext from '../contexts/DarkModeContext';

/**
 * Renders the Monaco code editor. Allows highlighting and editing through the
 * passed-in props.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.name
 *        The name of the editor
 * @param {string} props.src
 *        The source code to display
 * @param {function} props.setSrc
 *        A function to update the source code
 * @param {(number | [number, number] | null)[]} props.highlights
 *        The line ranges to highlight
 * @param {(number | [number, number] | null)[]} props.greyouts
 *        The line ranges to grey out
 * @param {boolean} props.editing
 *        Whether the editor is in editing mode
 * @param {boolean} props.bindSrc
 *        Whether the editor's value should be bound to the source state
 */
export default function Monaco(
  {
    name,
    src,
    setSrc,
    highlights,
    greyouts,
    editing,
    bindSrc,
  }:
  {
    name: string
    src: string
    setSrc: (src: string) => void
    highlights: (number | [number, number] | null)[]
    greyouts: (number | [number, number] | null)[]
    editing: boolean
    bindSrc: boolean
  },
) {
  const isDark = useContext(DarkModeContext);

  const [monaco, setMonaco] = useState(null as [import('monaco-editor').editor.IStandaloneCodeEditor, typeof import('monaco-editor')] | null);
  const [decoration, setDecoration] = useState(null as import('monaco-editor').editor.IEditorDecorationsCollection | null);
  const [cursorPos, setCursorPos] = useState([0, 0] as [number, number]);
  const [selectionHandler, setSelectionHandler] =
    useState(null as import('monaco-editor').IDisposable | null);
  const [rem, setRem] = useState(14.0);

  useEffect(() => {
    if (!monaco) return;

    monaco[1].editor.setTheme(isDark ? 'avp-dark' : 'avp');

    monaco[0].updateOptions({
      readOnly: !editing,
      domReadOnly: !editing,
    });

    const oldCursorPos = cursorPos;

    monaco[0].setValue(
      (!editing) ?
        src?.replaceAll(/@[\w]+<.*> ?/g, '') :
        src,
    );

    monaco[0].setPosition({
      lineNumber: oldCursorPos[0],
      column: oldCursorPos[1],
    });
  }, [isDark, monaco, editing]);

  useEffect(() => {
    if (monaco === null) return;

    decoration?.clear();

    setDecoration(
      monaco[0].createDecorationsCollection([
        ...highlights.map((highlight) => {
          if (highlight === null) return null;
          if (typeof highlight === 'number') return { range: new monaco[1].Range(highlight, 1, highlight, 1), options: { className: 'avp-highlight' } };
          return { range: new monaco[1].Range(highlight[0], 1, highlight[1], 1), options: { className: 'avp-highlight' } };
        }).filter(highlight => highlight !== null),
        ...greyouts.map((greyout) => {
          if (greyout === null) return null;
          if (typeof greyout === 'number') return { range: new monaco[1].Range(greyout, 1, greyout, 1), options: { className: 'avp-greyout' } };
          return { range: new monaco[1].Range(greyout[0], 1, greyout[1], 1), options: { className: 'avp-greyout' } };
        }).filter(greyout => greyout !== null),
      ]),
    );

    if (highlights.length === 1 && greyouts.length === 0) {
      if (highlights[0] === null) return;

      monaco[0].revealLineInCenterIfOutsideViewport(
        (typeof highlights[0] === 'number') ?
          highlights[0] :
          highlights[0][0],
      );
    }
  }, [highlights, greyouts, monaco, isDark]);

  useEffect(() => {
    if (monaco === null) return;

    if (selectionHandler) {
      selectionHandler.dispose();
      setSelectionHandler(null);
    }

    setSelectionHandler(
      monaco[0].onDidChangeCursorSelection((e) => {
        setCursorPos(
          [e.selection.positionLineNumber, e.selection.positionColumn],
        );
      }),
    );
  }, [monaco, editing]);

  useEffect(() => {
    if (monaco === null) return;

    if (bindSrc) {
      decoration?.clear();

      monaco[0].setValue(
        (!editing) ?
          src?.replaceAll(/@[\w]+<.*> ?/g, '') :
          src,
      );

      setDecoration(
        monaco[0].createDecorationsCollection([
          ...highlights.map((highlight) => {
            if (highlight === null) return null;
            if (typeof highlight === 'number') return { range: new monaco[1].Range(highlight, 1, highlight, 1), options: { className: 'avp-highlight' } };
            return { range: new monaco[1].Range(highlight[0], 1, highlight[1], 1), options: { className: 'avp-highlight' } };
          }).filter(highlight => highlight !== null),
          ...greyouts.map((greyout) => {
            if (greyout === null) return null;
            if (typeof greyout === 'number') return { range: new monaco[1].Range(greyout, 1, greyout, 1), options: { className: 'avp-greyout' } };
            return { range: new monaco[1].Range(greyout[0], 1, greyout[1], 1), options: { className: 'avp-greyout' } };
          }).filter(greyout => greyout !== null),
        ]),
      );
    }
  }, [monaco, src]);

  useEffect(() => {
    setRem(parseFloat(getComputedStyle(document.documentElement).fontSize));
  }, []);

  return (
    <div
      id={name}
      className="w-full h-full"
    >
      <style>
        {(!editing) && `
          #${name} .monaco-editor {
            & .view-overlays svg > circle,
            & .decorationsOverviewRuler {
              display: none !important;
            }

            & .core-guide-indent.indent-active {
              box-shadow: 1px 0 0 0 var(--indent-color) inset !important;
            }
            
            & .active-line-number {
              color: var(--vscode-editorLineNumber-foreground) !important;
            }

            & .current-line-exact {
              border: none !important;
            }

            & .cursor {
              opacity: 0 !important;
            }

            & .wordHighlightText,
            & .selectionHighlight {
              background-color: transparent !important;
            }

            & .monaco-editor-overlaymessage {
              display: none !important;
            }
          }
        `}
      </style>
      <Editor
        options={{
          minimap: { enabled: false },
          padding: { top: 10 },
          fontSize: rem * 0.9,
        }}
        onMount={
          (editor, monaco) => {
            monaco.languages.register({ id: 'avp' });
            monaco.languages.setMonarchTokensProvider('avp', Defs.AVPLanguage);

            monaco.editor.setModelLanguage(editor.getModel()!, 'avp');

            monaco.editor.defineTheme('avp', Defs.AVPLightTheme);
            monaco.editor.defineTheme('avp-dark', Defs.AVPDarkTheme);

            setMonaco([editor, monaco]);
          }
        }
        onChange={
          (value) => {
            if (!editing) return;

            setSrc(value || '');
          }
        }
        className="**:transition-none"
      />
    </div>
  );
}
