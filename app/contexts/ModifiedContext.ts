import { createContext } from 'react';

/**
 * Provides the modified state of the current algorithm to any rendered element.
 */
const ModifiedContext = createContext(
  [
    null,
    (_: number | null) => {},
  ] as [
    number | null,
    (modified: number | null) => void,
  ],
);

export default ModifiedContext;
