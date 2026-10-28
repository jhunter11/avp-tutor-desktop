import Globals from '../globals';

import AppFrame from '../components/frames/AppFrame';

import PageMeta from '../components/PageMeta';
import Visualizer from '../components/Visualizer';

import useTitle from '../hooks/useTitle';
import useSidebar from '../hooks/useSidebar';

/**
 * Renders the "Run" page.
 *
 * This is the main app page and should provide a fully interactive
 * visualization of the selected algorithm.
 */
export default function Run() {
  const [title, setTitle] = useTitle();
  const [
    sidebar,
    setSidebar,
    sidebarDefaultWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    sidebarWidth,
    setSidebarWidth,
  ] = useSidebar();

  return (
    <>
      <PageMeta
        title={title}
        description="Visualize and learn about this algorithm for free."
      />
      <AppFrame
        title={title}
        setTitle={setTitle}
        mutable={true}
        sidebar={sidebar}
        setSidebar={setSidebar}
        menuLinks={Globals.MenuLinksRun}
      >
        <Visualizer
          sidebar={sidebar}
          setSidebar={setSidebar}
          sidebarDefaultWidth={sidebarDefaultWidth}
          sidebarMinWidth={sidebarMinWidth}
          sidebarMaxWidth={sidebarMaxWidth}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          setTitle={setTitle}
        />
      </AppFrame>
    </>
  );
}
