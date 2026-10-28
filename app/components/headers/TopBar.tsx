import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  IconButton,
  Input,
  Navbar,
  Typography,
} from '@material-tailwind/react';

import {
  HelpCircle,
  Menu,
  SidebarCollapse,
  SidebarExpand,
} from 'iconoir-react';

import Globals from '../../globals';

import FlexSpacer from '../FlexSpacer';

import ModifiedContext from '../../contexts/ModifiedContext';

/**
 * Renders the title and navigation bar.
 *
 * `title`/`setTitle` and `sidebar`/`setSidebar` should be defined state
 * variables if the intent is for them to be mutable.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.title
 *        The title to display
 * @param {function | undefined} props.setTitle
 *        A function to update the title
 * @param {boolean} props.mutable
 *        Whether the title is mutable
 * @param {boolean | null | undefined} props.sidebar
 *        Whether the sidebar is toggled
 * @param {function | undefined} props.setSidebar
 *        A function to update the sidebar state
 * @param {React.RefObject} props.menuTrigger
 *        An element reference that opens the main menu on click
 * @param {React.RefObject} props.menuPanel
 *        An element reference that contains the main menu panel
 */
export default function TopBar(
  {
    title,
    setTitle,
    mutable,
    sidebar,
    setSidebar,
    menuTrigger,
    menuPanel,
  }:
  {
    title: string
    setTitle: ((title: string) => void) | undefined
    mutable: boolean
    sidebar: boolean | null | undefined
    setSidebar: ((value: boolean | null) => void) | undefined
    menuTrigger: React.RefObject<HTMLElement>
    menuPanel: React.RefObject<HTMLElement>
  },
) {
  const [modified, setModified] = useContext(ModifiedContext);

  const [width, setWidth] = useState(0);
  const [titleInterval, setTitleInterval] = useState(
    null as NodeJS.Timeout | null,
  );

  const pre = useRef({ offsetWidth: 0 } as HTMLPreElement);
  const input = useRef({
    value: '',
    setSelectionRange: () => {},
    blur: () => {},
  } as unknown as HTMLInputElement);

  useEffect(() => {
    document.body.addEventListener('click', (event) => {
      if (event.target === input.current) return;
      input.current?.blur();
    });

    // Ensure the title is the correct width after a page reload
    setTitleInterval(
      setInterval(() => {
        if (setTitle && title !== input.current?.value) {
          setTitle(input.current?.value ?? '');
        } else if (titleInterval) {
          clearInterval(titleInterval);
        }
      }, 250),
    );
  }, []);

  if (setTitle) {
    // Using a layout effect here to avoid jittery repaints while typing
    useLayoutEffect(() => {
      // If the content is empty, set it to '<unnamed>' to avoid 0-width input
      if (title.length === 0) {
        setTitle('<unnamed>');
        input.current.value = '<unnamed>';
        input.current.setSelectionRange(0, 9); // Length of '<unnamed>'
      }

      setWidth(pre.current?.offsetWidth ?? 0);
    }, [title, pre]);
  }

  return (
    <Navbar className="rounded-none flex items-center border-[#d8d8dc] dark:border-[#38383c] border-t-0 border-l-0 border-r-0 shadow-none bg-[#ffffff] dark:bg-[#18181c]">
      <IconButton
        variant="ghost"
        aria-label="Main Menu"
        title="Main Menu"
        onClick={() => {
          menuTrigger.current.click();
          const interval = setInterval(() => {
            if (menuPanel.current?.scrollTop) {
              menuPanel.current.scrollTop = 0;
              clearInterval(interval);
            }
          }, 10);
        }}
        aria-haspopup="dialog"
        className="cursor-pointer"
      >
        <Menu className="stroke-2 w-6 h-6" role="presentation" />
      </IconButton>

      {
        mutable && setTitle ?
          (
            <div className="flex items-center">
              <pre
                ref={pre}
                id="title"
                className="text-lg font-medium font-body p-1 opacity-0 absolute pointer-events-none"
                aria-hidden
              >
                {title}
              </pre>
              <Input
                ref={input}
                type="text"
                size="lg"
                defaultValue={title}
                className="text-lg! font-medium ml-1 border-0 ring-2 shadow-none p-1 transition-none"
                style={{ width }}
                onChange={
                  (event) => {
                    setTitle(event.target.value);
                    setModified(modified || 1);
                  }
                }
                onKeyUp={
                  (event) => {
                    if (event.key === 'Enter') {
                      input.current?.blur();
                    }
                  }
                }
                aria-label="Algorithm name"
              />
              {
                modified ?
                  (
                    <Typography
                      type="h2"
                      className="text-sm! font-light opacity-50 ml-2 pointer-events-none"
                    >
                      Modified
                    </Typography>
                  ) :
                  (<></>)
              }
            </div>
          ) :
          (
            <Typography
              id="title"
              type="h1"
              className="text-lg! font-medium ml-2"
            >
              {title}
            </Typography>
          )
      }

      <FlexSpacer />

      {
        (sidebar !== undefined && setSidebar) ?
          (
            <>
              <IconButton
                variant="ghost"
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar"
                className="-scale-x-100 cursor-pointer"
                onClick={
                  () => setSidebar(!((sidebar === null) ? true : sidebar))
                }
              >
                {
                  ((sidebar === null) ? true : sidebar) ?
                    <SidebarCollapse className="stroke-2 w-6 h-6" role="presentation" /> :
                    <SidebarExpand className="stroke-2 w-6 h-6" role="presentation" />
                }
              </IconButton>
              <div
                role="separator"
                className="w-px h-8 mx-2 bg-[#d8d8dc] dark:bg-[#38383c]"
              />
            </>
          ) :
          (<></>)
      }

      <IconButton
        as="a"
        variant="ghost"
        aria-label="Get Help"
        title="Get Help"
        href={`${Globals.RouteBaseName}wiki`}
        target="_blank"
      >
        <HelpCircle className="stroke-2 w-6 h-6" role="presentation" />
      </IconButton>
    </Navbar>
  );
}
