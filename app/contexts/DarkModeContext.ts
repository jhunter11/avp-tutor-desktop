import { createContext } from 'react';

/**
 * Provides the dark mode state of the application to any rendered element.
 */
const DarkModeContext = createContext(false);

export default DarkModeContext;
