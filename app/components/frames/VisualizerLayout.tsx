import { useEffect, useState } from 'react';

import { IconButton } from '@material-tailwind/react';

import {
  Movie,
  Code,
  CodeBrackets,
  ChatBubble,
} from 'iconoir-react';

import PaneHeader from '../headers/PaneHeader';

import ResizeHandle from '../ResizeHandle';

import usePortrait from '../../hooks/usePortrait';

/**
 * Renders a visualizer complete with collapsible sidebar. Includes animation,
 * code tracing, variables, and [TODO] AI panes.
 *
 * @param {Object} props
 *        React props
 * @param {boolean | null} props.editing
 *        Whether the code pane is in editing mode
 * @param {function} props.setEditing
 *        A function to update the editing state
 * @param {function} props.save
 *        A function to save the changes
 * @param {function} props.discard
 *        A function to discard the changes
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
 * @param {number | null} props.codePaneHeight
 *        The height in px of the code pane
 * @param {function} props.setCodePaneHeight
 *        A function to update the height of the code pane
 * @param {number | null} props.varsPaneHeight
 *        The height in px of the variables pane
 * @param {function} props.setVarsPaneHeight
 *        A function to update the height of the variables pane
 * @param {number | null} props.AIPaneHeight
 *        The height in px of the AI pane
 * @param {function} props.setAIPaneHeight
 *        A function to update the height of the AI pane
 * @param {number} props.defaultPaneHeight
 *        The default height in px of a pane
 * @param {number} props.minPaneHeight
 *        The minimum height in px of a pane
 * @param {number} props.maxPaneHeight
 *        The maximum height in px of a pane
 * @param {React.ReactNode[]} props.children
 *        Child elements
 */
export default function VisualizerLayout(
  {
    editing,
    setEditing,
    save,
    discard,
    sidebar,
    setSidebar,
    sidebarDefaultWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    sidebarWidth,
    setSidebarWidth,
    codePaneHeight,
    setCodePaneHeight,
    varsPaneHeight,
    setVarsPaneHeight,
    AIPaneHeight,
    setAIPaneHeight,
    defaultPaneHeight,
    minPaneHeight,
    maxPaneHeight,
    children,
  }:
  {
    editing: boolean
    setEditing: (editing: boolean) => void
    save: () => void
    discard: () => void
    sidebar: boolean | null | undefined
    setSidebar: (sidebar: boolean | null | undefined) => void
    sidebarDefaultWidth: number
    sidebarMinWidth: number
    sidebarMaxWidth: number
    sidebarWidth: number | null
    setSidebarWidth: (width: number | null) => void
    codePaneHeight: number | null
    setCodePaneHeight: (height: number) => void
    varsPaneHeight: number | null
    setVarsPaneHeight: (height: number) => void
    AIPaneHeight: number | null
    setAIPaneHeight: (height: number) => void
    defaultPaneHeight: number
    minPaneHeight: number
    maxPaneHeight: number
    children: React.ReactNode[]
  },
) {
  const [portrait] = usePortrait();

  const [pane, setPane] = useState(0);

  useEffect(() => {
    setSidebar(portrait ? undefined : (sidebar === undefined) ? true : sidebar);
  }, [portrait]);

  return portrait ?
    (
      <div className="w-full h-full">
        <section className="w-full h-full">
          {
            children.map((child, index) => (
              <div
                key={index}
                className={`absolute top-13.75 w-full h-[calc(100%-7.5rem+2px)] ${(index === 0) && 'bg-[#fafafc] dark:bg-[#1d1d20]'} ${(pane === index) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {child}
              </div>
            ))
          }
        </section>
        <div className="sticky bottom-0 w-full flex justify-around py-3 px-4 border-t border-[#d8d8dc] dark:border-[#38383c]">
          <IconButton
            variant="ghost"
            aria-label="Go to Visualization Pane"
            aria-haspopup="true"
            aria-expanded={(pane === 0) ? 'true' : 'false'}
            title="Visualization Pane"
            onClick={() => setPane(0)}
            className={`cursor-pointer w-20 rounded-full ${(pane === 0) && 'bg-primary/10'}`}
          >
            <Movie className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Go to Code Pane"
            aria-haspopup="true"
            aria-expanded={(pane === 1) ? 'true' : 'false'}
            title="Code Pane"
            onClick={() => setPane(1)}
            className={`cursor-pointer w-20 rounded-full ${(pane === 1) && 'bg-primary/10'}`}
          >
            <Code className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Go to Variables Pane"
            aria-haspopup="true"
            aria-expanded={(pane === 2) ? 'true' : 'false'}
            title="Variables Pane"
            onClick={() => setPane(2)}
            className={`cursor-pointer w-20 rounded-full ${(pane === 2) && 'bg-primary/10'}`}
          >
            <CodeBrackets className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Go to AI Pane"
            aria-haspopup="true"
            aria-expanded={(pane === 3) ? 'true' : 'false'}
            title="AI Pane"
            onClick={() => setPane(3)}
            className={`cursor-pointer w-20 rounded-full ${(pane === 3) && 'bg-primary/10'}`}
          >
            <ChatBubble className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
        </div>
      </div>
    ) :
    (
      <div className="flex w-full h-full">
        <section
          style={{ width: `${(sidebar) ? `calc(100dvw - ${sidebarWidth}px)` : '100dvw'}` }}
          className="transition-none bg-[#fafafc] dark:bg-[#1d1d20]"
        >
          {children[0]}
        </section>
        {
          ((sidebar === null) ? true : sidebar) && (
            <aside
              style={{ width: `${(sidebarWidth || 0)}px` }}
              className="flex flex-col border-l border-[#d8d8dc] dark:border-[#38383c] transition-none overflow-hidden"
            >
              <ResizeHandle
                position="left"
                size={sidebarWidth}
                otherSize={sidebarMaxWidth}
                setSize={setSidebarWidth}
                defaultSize={sidebarDefaultWidth}
                minSize={sidebarMinWidth}
                maxSize={sidebarMaxWidth}
              />
              <section
                style={{ height: `${(codePaneHeight || 0)}px` }}
                className="transition-none overflow-hidden"
              >
                <PaneHeader
                  title="Source Code"
                  editing={editing}
                  setEditing={setEditing}
                  save={save}
                  discard={discard}
                  paneHeight={codePaneHeight}
                  setPaneHeight={setCodePaneHeight}
                  defaultPaneHeight={defaultPaneHeight}
                  minPaneHeight={minPaneHeight}
                />
                {children[1]}
              </section>
              <section
                style={{ height: `${(varsPaneHeight || 0)}px` }}
                className="transition-none border-t border-[#d8d8dc] dark:border-[#38383c] overflow-hidden"
              >
                <ResizeHandle
                  position="top"
                  size={varsPaneHeight}
                  otherSize={codePaneHeight}
                  setSize={setVarsPaneHeight}
                  defaultSize={defaultPaneHeight}
                  minSize={minPaneHeight}
                  maxSize={maxPaneHeight}
                />
                <PaneHeader
                  title="Variables"
                  editing={undefined}
                  setEditing={undefined}
                  save={undefined}
                  discard={undefined}
                  paneHeight={varsPaneHeight}
                  setPaneHeight={setVarsPaneHeight}
                  defaultPaneHeight={defaultPaneHeight}
                  minPaneHeight={minPaneHeight}
                />
                {children[2]}
              </section>
              <section
                style={{ height: `${(AIPaneHeight || 0)}px` }}
                className="transition-none border-t border-[#d8d8dc] dark:border-[#38383c] overflow-hidden"
              >
                <ResizeHandle
                  position="top"
                  size={AIPaneHeight}
                  otherSize={varsPaneHeight}
                  setSize={setAIPaneHeight}
                  defaultSize={defaultPaneHeight}
                  minSize={minPaneHeight}
                  maxSize={maxPaneHeight}
                />
                <PaneHeader
                  title="AlgoAI"
                  editing={undefined}
                  setEditing={undefined}
                  save={undefined}
                  discard={undefined}
                  paneHeight={AIPaneHeight}
                  setPaneHeight={setAIPaneHeight}
                  defaultPaneHeight={defaultPaneHeight}
                  minPaneHeight={minPaneHeight}
                />
                {children[3]}
              </section>
            </aside>
          )
        }
      </div>
    );
}
