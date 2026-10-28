import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import {
  Button,
  Typography,
} from '@material-tailwind/react';

import { ArrowLeft } from 'iconoir-react';

import PageMeta from './components/PageMeta';

import type { Route } from './+types/root';
import './app.css';

import Globals from './globals';

/**
 * Root layout component used across all routes.
 *
 * @param {Object} props
 *        React props
 * @param {React.ReactNode} props.children
 *        Child elements
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" />

        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="manifest.json" />

        <meta
          property="og:image"
          content="?????"
        />

        <Links />
        <Meta />
      </head>

      <body className="h-screen overflow-hidden">
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Error boundary component used in place of Layout when a route fails to load.
 * In this case, we actually call Layout to keep a consistent look.
 *
 * NOTE: This only works when SSR is enabled, meaning we will not see this in
 *       any statically prerendered production builds.
 *
 * @param {Object} props
 *        React props
 * @param {React.ReactNode} props.children
 *        Child elements
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ?
        'The requested page could not be found.' :
        error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Layout>
      <PageMeta
        title={message}
        description={details}
      />

      <div className="bg-background-dark text-primary w-screen h-screen flex flex-col items-center justify-center">
        <Typography
          variant="h1"
          className="text-8xl font-light mb-6"
        >
          {message}
        </Typography>
        <Typography
          variant="h2"
          className="text-2xl font-light"
        >
          {details}
        </Typography>
        <Button
          as="a"
          variant="outline"
          size="xl"
          href={Globals.RouteBaseName}
          className="text-xl text-primary font-light mt-[12.5vh] cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-2 mr-3 -ml-1" role="presentation" />
          Go Home
        </Button>
        {
          stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )
        }
      </div>
    </Layout>
  );
}

export default function App() {
  return <Outlet />;
}
