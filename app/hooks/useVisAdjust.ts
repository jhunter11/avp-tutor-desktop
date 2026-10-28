import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit visualization adjustment states.
 */
export default function useVisAdjust() {
  // Multipliers of DEFAULT_SPEED
  const SPEEDS = [
    0.1, 0.25, 0.33, 0.5,
    0.66, 0.75, 0.9, 1.0,
    1.1, 1.25, 1.5, 1.75,
    2, 2.5, 3, 3.5, 4, 5,
    10,
  ];

  const DEFAULT_SPEED = 1000;
  const MIN_SPEED = DEFAULT_SPEED / SPEEDS[0];
  const MAX_SPEED = DEFAULT_SPEED / SPEEDS[SPEEDS.length - 1];

  const DEFAULT_ZOOM = 1.0;
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 40.0;

  const [zoom, setZoom] = useState(null as number | null);
  const [speed, setSpeed] = useState(null as number | null);

  useEffect(() => {
    if (zoom === null) return;

    if (zoom < MIN_ZOOM) {
      setZoom(MIN_ZOOM);
    } else if (zoom > MAX_ZOOM) {
      setZoom(MAX_ZOOM);
    }

    localStorage.setItem('zoom', `${zoom}`);
  }, [zoom]);

  useEffect(() => {
    if (speed === null) return;

    if (speed > MIN_SPEED) {
      setSpeed(MIN_SPEED);
    } else if (speed < MAX_SPEED) {
      setSpeed(MAX_SPEED);
    }

    localStorage.setItem('speed', `${speed}`);
  }, [speed]);

  useEffect(() => {
    setZoom(parseFloat(localStorage.getItem('zoom') || `${DEFAULT_ZOOM}`));
    setSpeed(parseInt(localStorage.getItem('speed') || `${DEFAULT_SPEED}`));
  }, []);

  function getNextSpeed(speed: number, dir: number) {
    const idx = SPEEDS
      .findIndex(s => s == DEFAULT_SPEED / speed) + ((dir > 0) ? 1 : -1);

    return (idx >= 0 && idx < SPEEDS.length) ?
      DEFAULT_SPEED / SPEEDS[idx] :
      speed;
  }

  function setSpeedInt(num: number) {
    setSpeed(DEFAULT_SPEED / SPEEDS[num]);
  }

  return [
    zoom,
    setZoom,
    speed,
    setSpeed,
    setSpeedInt,
    getNextSpeed,
    SPEEDS,
    DEFAULT_SPEED,
    DEFAULT_ZOOM,
    MIN_ZOOM,
    MAX_ZOOM,
  ] as const;
}
