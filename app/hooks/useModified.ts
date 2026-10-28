import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit page modified state.
 */
export default function useModified() {
  const [modified, setModified] = useState(0 as number | null);

  useEffect(() => {
    if (modified) {
      addEventListener('beforeunload', event => event.preventDefault());
    } else {
      removeEventListener('beforeunload', event => event.preventDefault());
    }
  }, [modified]);

  return [modified, setModified] as const;
}
