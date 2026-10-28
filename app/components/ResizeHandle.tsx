/**
 * Renders a resize handle that can be used to update a state variable tied to
 * an element's width.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.position
 *        The position of the resize handle. Must be either "top" or "left"
 * @param {number | null} props.size
 *        The current size in px of the element being resized
 * @param {number | null} props.otherSize
 *        The current size in px of the element on the other side of the resize
 *        handle from the element being resized
 * @param {function} props.setSize
 *        A function to update the size of the element being resized
 * @param {number} props.defaultSize
 *        The default size in px of the element being resized
 * @param {number} props.minSize
 *        The minimum size in px of the element being resized
 * @param {number} props.maxSize
 *        The maximum size in px of the element being resized
 */
export default function ResizeHandle(
  {
    position,
    size,
    otherSize,
    setSize,
    defaultSize,
    minSize,
    maxSize,
  }:
  {
    position: string
    size: number | null
    otherSize: number | null
    setSize: (size: number) => void
    defaultSize: number
    minSize: number
    maxSize: number
  },
) {
  let dragging = null as number | null;

  function mouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;

    dragging = (position === 'top') ? e.clientY : e.clientX;

    addEventListener('mousemove', mouseMove);
    addEventListener('mouseup', mouseUpLeft);

    e.preventDefault();
  }

  function mouseMove(e: MouseEvent) {
    if (dragging === null) return;

    const offset = (position === 'top') ? e.clientY : e.clientX;
    const newSize = (size || 0) + (dragging - offset);

    const newOtherSize = (otherSize || 0) - (dragging - offset);
    const diff = newOtherSize - minSize;

    setSize(
      Math.min(
        Math.max(
          newSize + (
            (diff >= 0) ?
              0 :
              diff
          ),
          minSize,
        ),
        maxSize,
      ),
    );
  }

  function mouseUpLeft(e: MouseEvent) {
    if (e.button !== 0) return;

    dragging = null;

    removeEventListener('mousemove', mouseMove);
    removeEventListener('mouseup', mouseUpLeft);

    e.preventDefault();
  }

  function mouseUpRight(e: React.MouseEvent) {
    if (e.button !== 2) return;

    setSize(defaultSize);
    e.preventDefault();
  }

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      onMouseDown={mouseDown}
      onMouseUp={mouseUpRight}
      className={`absolute z-50 ${position === 'top' && 'w-full h-4 -translate-y-2 cursor-ns-resize'} ${position === 'left' && 'w-4 h-full -translate-x-2 cursor-ew-resize'}`}
    />
  );
}
