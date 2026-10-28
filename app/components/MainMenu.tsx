import {
  Drawer,
  IconButton,
  List,
  Typography,
} from '@material-tailwind/react';

import {
  Iconoir,
  Menu,
} from 'iconoir-react';

import Globals from '../globals';

import FlexSpacer from './FlexSpacer';
import DarkModeToggle from './DarkModeToggle';

/**
 * Renders the main menu sidebar panel.
 *
 * @param {Object} props
 *        React props
 * @param {boolean | null} props.isDark
 *        Whether dark mode is enabled or not
 * @param {function} props.setIsDark
 *        A function to update the dark mode state
 * @param {React.RefObject} props.triggerRef
 *        An element reference that opens the main menu on click
 * @param {React.RefObject} props.panelRef
 *        An element reference that contains the main menu panel
 * @param {object[]} props.links
 *        The links to display in the main menu
 */
export default function MainMenu(
  {
    isDark,
    setIsDark,
    triggerRef,
    panelRef,
    links,
  }:
  {
    isDark: boolean | null
    setIsDark: ((value: boolean | null) => void)
    triggerRef: React.RefObject<HTMLElement>
    panelRef: React.RefObject<HTMLElement>
    links: readonly {
      icon: typeof Iconoir
      text: string
      href?: string
      onClick?: () => void
      disabled?: boolean
      separateNext: boolean
    }[]
  },
) {
  return (
    <Drawer>
      <Drawer.Trigger
        ref={triggerRef}
        className="hidden"
        aria-hidden
      />
      <Drawer.Overlay className="bg-[#000004]/50">
        <Drawer.Panel
          ref={panelRef}
          placement="left"
          className="bg-[#ffffff] dark:bg-[#18181c] border-[#d8d8dc] dark:border-[#38383c] border-0 border-r p-2 flex flex-col w-fit max-w-[67vw] max-h-dvh overflow-y-scroll rounded-r-md"
        >
          <header className="-mx-2 flex items-center p-2 border-b border-[#d8d8dc] dark:border-[#38383c] sticky top-0 bg-[#ffffff] dark:bg-[#18181c] -translate-y-2">
            <IconButton
              variant="ghost"
              aria-label="Main Menu"
              title="Main Menu"
              onClick={() => {
                triggerRef.current.click();
                const interval = setInterval(() => {
                  if (panelRef.current?.scrollTop) {
                    panelRef.current.scrollTop = 0;
                    clearInterval(interval);
                  }
                }, 10);
              }}
              aria-haspopup="dialog"
              className="cursor-pointer mr-2"
            >
              <Menu className="stroke-2 w-6 h-6" role="presentation" />
            </IconButton>
            <a href={Globals.RouteBaseName} className="mr-2">
              <Typography
                variant="h1"
                className="text-lg! font-medium inline-block"
              >
                {Globals.AppName}
              </Typography>
              <Typography
                variant="h2"
                className="text-sm! inline-block ml-1"
              >
                {Globals.AppVersion}
              </Typography>
            </a>
          </header>

          <nav>
            <List className="text-lg -mt-1 mb-1 gap-0">
              {
                links.map(
                  (
                    { icon: Icon, text, href, onClick, disabled, separateNext },
                  ) => (
                    <a key={text} href={href} onClick={onClick}>
                      <List.Item className={`p-2 ${disabled ? 'text-primary/50! hover:bg-transparent focus:bg-transparent' : 'text-primary hover:bg-primary/5 focus:bg-primary/5'}`}>
                        <List.ItemStart>
                          <Icon className="h-6 w-6 stroke-2 mr-1" role="presentation" />
                        </List.ItemStart>
                        {text}
                      </List.Item>
                      {separateNext && <div role="presentation" className="border-b border-[#d8d8dc] dark:border-[#38383c] my-1" />}
                    </a>
                  ),
                )
              }
            </List>
          </nav>

          <FlexSpacer />

          <footer className="-mx-2 px-4 pt-3 pb-1.25 border-t border-[#d8d8dc] dark:border-[#38383c] flex justify-between items-center">
            <div>
              <Typography
                className="text-sm!"
              >
                Licensed under the
                {` ${Globals.AppLicense}`}
              </Typography>
              <Typography
                className="text-sm!"
              >
                &copy;
                {` ${new Date().getFullYear()} `}
                Miami University
              </Typography>
              <Typography
                className="text-sm!"
              >
                <a
                  href={Globals.AppIssuesURL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-info"
                >
                  Report an Issue
                </a>
                {` | `}
                <a
                  href={Globals.AppSourceURL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-info"
                >
                  Source Code
                </a>
              </Typography>
            </div>
            <DarkModeToggle
              floating={false}
              isDark={isDark}
              setIsDark={setIsDark}
              showInPortrait={true}
            />
          </footer>
        </Drawer.Panel>
      </Drawer.Overlay>
    </Drawer>
  );
}
