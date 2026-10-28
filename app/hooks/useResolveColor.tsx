import { useContext } from 'react';

import DarkModeContext from '../contexts/DarkModeContext';

/**
 * Provides a hook to resolve a color string to a CSS-compatible color
 * string, taking into account the current dark mode state.
 */
export default function useResolveColor() {
  const isDark = useContext(DarkModeContext);

  function resolveColor(color: string, type: string) {
    switch (color) {
      case 'fg':
        return 'rgb(var(--color-primary) / 1)';

      case 'yellow':
        switch (type) {
          case 'outline':
            return isDark ? 'goldenrod' : 'darkgoldenrod';
          default:
            return 'yellow';
        }

      case 'green':
        switch (type) {
          case 'outline':
            return isDark ? 'limegreen' : 'green';
          case 'highlight':
            return isDark ? 'lime' : 'limegreen';
          default:
            return 'green';
        }

      // By default, assume color is already a valid CSS color string
      default:
        return color;
    }
  }

  return [
    resolveColor,
  ];
}
