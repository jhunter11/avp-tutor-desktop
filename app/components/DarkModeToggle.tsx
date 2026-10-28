import {
  HalfMoon,
  SunLight,
} from 'iconoir-react';

import { IconButton } from '@material-tailwind/react';

import usePortrait from '../hooks/usePortrait';

/**
 * Renders the dark mode toggle button.
 *
 * @param {Object} props
 *        React props
 * @param {boolean} props.floating
 *        Whether the button should be floating or not
 * @param {boolean | null} props.isDark
 *        Whether dark mode is enabled or not
 * @param {function} props.setIsDark
 *        A function to update the dark mode state
 * @param {boolean} props.showInPortrait
 *        Whether to show the button in portrait mode or landscape
 */
export default function DarkModeToggle(
  {
    floating,
    isDark,
    setIsDark,
    showInPortrait,
  }:
  {
    floating: boolean
    isDark: boolean | null
    setIsDark: ((value: boolean | null) => void)
    showInPortrait: boolean
  },
) {
  const [portrait] = usePortrait();

  return (portrait == showInPortrait) ?
    (
      <div className="not-portrait:absolute not-portrait:bottom-2 not-portrait:left-2">
        <IconButton
          variant="ghost"
          aria-label={`${isDark ? 'Disable' : 'Enable'} Dark Mode`}
          title={`${isDark ? 'Disable' : 'Enable'} Dark Mode`}
          onClick={() => setIsDark(!(isDark || false))}
          className={`${floating ? 'opacity-50' : 'opacity-100'} hover:opacity-100 focus-visible:opacity-100 active:opacity-100 transition-opacity cursor-pointer`}
        >
          {
            (isDark || false) ?
              <HalfMoon className="h-6 w-6 stroke-2" role="presentation" /> :
              <SunLight className="h-6 w-6 stroke-2" role="presentation" />
          }
        </IconButton>
      </div>
    ) :
    <></>;
}
