import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit page title state.
 */
export default function useTitle() {
  const [title, setTitle] = useState('<unnamed>');

  useEffect(() => {
    if (title === '') return;
    localStorage.setItem('title', title);
  }, [title]);

  return [title, setTitle] as const;
}
