import Globals from '../globals';

import AppFrame from '../components/frames/AppFrame';

import PageMeta from '../components/PageMeta';
import SearchProvider from '../components/SearchProvider';

/**
 * Renders the "Getting Started" page.
 *
 * This is the main landing page and should list available algorithms, allowing
 * the user to find and select one, or to create their own.
 */
export default function Index() {
  return (
    <>
      <PageMeta
        title="Home"
        description="Select an algorithm or create your own to begin learning."
      />
      <AppFrame
        title={Globals.AppName}
        setTitle={undefined}
        mutable={false}
        sidebar={undefined}
        setSidebar={undefined}
        menuLinks={Globals.MenuLinksHome}
      >
        <SearchProvider
          cards={Globals.AlgorithmCards}
        />
      </AppFrame>
    </>
  );
}
