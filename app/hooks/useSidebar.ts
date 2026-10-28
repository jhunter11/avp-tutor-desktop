import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit sidebar toggle and width states.
 */
export default function useSidebar() {
  const [sidebar, setSidebar] = useState(null as boolean | null | undefined);
  const [sidebarWidth, setSidebarWidth] = useState(null as number | null);
  const [sidebarDefaultWidth, setSidebarDefaultWidth] = useState(0);
  const [sidebarMinWidth, setSidebarMinWidth] = useState(0);
  const [sidebarMaxWidth, setSidebarMaxWidth] = useState(0);

  function updateDefaults() {
    setSidebarDefaultWidth(document.body.querySelector('main')!.clientWidth / 3);
    setSidebarMinWidth(document.body.querySelector('main')!.clientWidth / 6);
    setSidebarMaxWidth(document.body.querySelector('main')!.clientWidth * 3 / 4);
  }

  useEffect(() => {
    if (sidebar === null || sidebar === undefined) return;
    localStorage.setItem('sidebar', sidebar.toString());
  }, [sidebar]);

  useEffect(() => {
    if (sidebarWidth === null) return;
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    setSidebar(
      (localStorage.getItem('sidebar') === null) ?
        true :
        localStorage.getItem('sidebar') === 'true',
    );

    window.addEventListener('resize', updateDefaults);
    updateDefaults();
  }, []);

  useEffect(() => {
    if (sidebarDefaultWidth === 0) return;

    setSidebarWidth(
      Math.min(
        Math.max(
          parseInt(localStorage.getItem('sidebarWidth') || '0') || sidebarDefaultWidth,
          sidebarMinWidth,
        ),
        sidebarMaxWidth,
      ),
    );
  }, [sidebarDefaultWidth, sidebarMinWidth, sidebarMaxWidth]);

  return [
    sidebar,
    setSidebar,
    sidebarDefaultWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    sidebarWidth,
    setSidebarWidth,
  ] as const;
}
