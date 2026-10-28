import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to toggle and read dark mode.
 */
export default function useDarkMode() {
  const [isDark, setIsDark] = useState(null as boolean | null);

  useEffect(() => {
    if (isDark === null) return;

    // Toggle app dark mode (use Tailwind styles prefixed with dark:)
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // Use system color scheme to init app color scheme on load
    setIsDark(
      localStorage.theme === 'dark' ||
      (
        !('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ),
    );
  }, []);

  return [isDark, setIsDark] as const;
}
