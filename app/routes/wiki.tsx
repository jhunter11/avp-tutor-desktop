import Globals from '../globals';

import AppFrame from '../components/frames/AppFrame';

import PageMeta from '../components/PageMeta';

import {
  Typography,
} from '@material-tailwind/react';

/**
 * Renders the "Wiki" page.
 *
 * This should provide an overview of everything a user needs
 * to know in order to use the app to its fullest extent.
 */
export default function Wiki() {
  return (
    <>
      <PageMeta
        title="Wiki"
        description="Learn how to use the application."
      />
      <AppFrame
        title={`${Globals.AppName} Wiki`}
        setTitle={undefined}
        mutable={false}
        sidebar={undefined}
        setSidebar={undefined}
        menuLinks={Globals.MenuLinksHome}
      >
        <div className="bg-background-dark text-primary w-screen h-screen flex flex-col items-center justify-center">
          <Typography
            variant="h1"
            className="text-8xl font-light mb-6"
          >
            Page Under Construction
          </Typography>
          <Typography
            variant="h2"
            className="text-2xl font-light"
          >
            More information coming soon
          </Typography>
        </div>
      </AppFrame>
    </>
  );
}
