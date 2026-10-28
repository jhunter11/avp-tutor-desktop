import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to manage the panning and movement of the visualization.
 *
 * @param {Object} props
 *        React props
 * @param {number | null} props.zoom
 *        The current zoom level of the visualization
 * @param {function} props.setZoom
 *        A function to update the zoom level of the visualization
 * @param {number} props.MIN_ZOOM
 *        The minimum zoom level of the visualization
 * @param {number} props.MAX_ZOOM
 *        The maximum zoom level of the visualization
 */
export default function useVisPan({
  zoom,
  setZoom,
  MIN_ZOOM,
  MAX_ZOOM,
}: {
  zoom: number | null
  setZoom: (zoom: number) => void
  MIN_ZOOM: number
  MAX_ZOOM: number
}) {
  const [offsetX, setOffsetX] = useState(0.0);
  const [offsetY, setOffsetY] = useState(0.0);

  const [move, setMove] = useState(null as MouseEvent | TouchEvent | null);
  const [touch, setTouch] =
    useState(null as React.TouchEvent | TouchEvent | null);

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (zoom === null) return;

    if (move && dragging) {
      if (touch) {
        if ((move as TouchEvent).touches.length === 2) {
          if (touch.touches.length !== 2) return;

          const oldTouch1 = (touch as TouchEvent).touches[0];
          const oldTouch2 = (touch as TouchEvent).touches[1];
          const newTouch1 = (move as TouchEvent).touches[0];
          const newTouch2 = (move as TouchEvent).touches[1];

          const oldDiff = Math.hypot(
            oldTouch1.clientX - oldTouch2.clientX,
            oldTouch1.clientY - oldTouch2.clientY,
          );
          const newDiff = Math.hypot(
            newTouch1.clientX - newTouch2.clientX,
            newTouch1.clientY - newTouch2.clientY,
          );

          if (newDiff === oldDiff) return;

          const diff = Math.abs(newDiff - oldDiff);
          if ((newDiff < oldDiff) && (
            zoom * Math.pow(0.99, diff) >= MIN_ZOOM
          )) {
            setZoom(zoom * Math.pow(0.99, diff));
            setOffsetX(offsetX * Math.pow(0.99, diff));
            setOffsetY(offsetY * Math.pow(0.99, diff));
          } else if (
            (newDiff > oldDiff) && (zoom * Math.pow(1.01, diff) <= MAX_ZOOM)
          ) {
            setZoom(zoom * Math.pow(1.01, diff));
            setOffsetX(offsetX * Math.pow(1.01, diff));
            setOffsetY(offsetY * Math.pow(1.01, diff));
          }
          setTouch(move as TouchEvent);

          return;
        }

        if (
          (move as TouchEvent).touches.length !== 1 ||
          touch.touches.length !== 1
        ) return;

        const oldTouch = (touch as TouchEvent).touches[0];
        const newTouch = (move as TouchEvent).touches[0];

        setOffsetX(offsetX + newTouch.clientX - oldTouch.clientX);
        setOffsetY(offsetY + newTouch.clientY - oldTouch.clientY);

        setTouch(move as TouchEvent);
      } else {
        setOffsetX(offsetX + (move as MouseEvent).movementX);
        setOffsetY(offsetY + (move as MouseEvent).movementY);
      }

      setMove(null);
    }
  }, [move, dragging]);

  function mouseUp() {
    setDragging(false);

    removeEventListener('mouseup', mouseUp);
    removeEventListener('mousemove', mouseMove);

    removeEventListener('touchmove', mouseMove);
    removeEventListener('touchend', mouseUp);

    setTouch(null);
  }

  function mouseMove(e: MouseEvent | TouchEvent) {
    setMove(e);
    e.preventDefault();
  }

  function mouseDown(e: React.MouseEvent | React.TouchEvent) {
    const isTouch = Object.keys(e).includes('touches');

    if (
      (!isTouch) &&
      (e as React.MouseEvent).button !== 0 &&
      (e as React.MouseEvent).button !== 1
    ) return;

    if (isTouch) {
      addEventListener('touchend', mouseUp);
      addEventListener('touchmove', mouseMove);

      setTouch(e as React.TouchEvent);
    } else {
      addEventListener('mouseup', mouseUp);
      addEventListener('mousemove', mouseMove);
    }

    setDragging(true);
    e.preventDefault();
  }

  return [
    offsetX,
    setOffsetX,
    offsetY,
    setOffsetY,
    dragging,
    mouseDown,
  ] as const;
}
