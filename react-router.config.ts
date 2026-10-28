import type { Config } from '@react-router/dev/config';
import Routes from './app/routes';
import Globals from './app/globals';

export default {
  ssr: false,
  basename: Globals.RouteBaseName,
  async prerender() {
    return Routes.map(route => `/${route.path ?? ''}`);
  },
} satisfies Config;
