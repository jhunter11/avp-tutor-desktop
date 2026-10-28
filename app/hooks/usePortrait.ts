import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read whether the app is in portrait mode.
 */
export default function usePortrait() {
  const [portrait, setPortrait] = useState(false);

  useEffect(
    () => setPortrait(matchMedia('(orientation: portrait)').matches), [],
  );

  return [portrait] as const;
}
