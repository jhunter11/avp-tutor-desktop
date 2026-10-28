import type { Config } from 'tailwindcss';
import { mtConfig } from '@material-tailwind/react';

const config: Config = {
  darkMode: 'selector',
  plugins: [mtConfig],
};

export default config;
