import { useState } from 'react';

let progressDragData = null as null | {
  target: HTMLElement
  low: number
  high: number
  round: number
  left: number
  width: number
  callback: (num: number) => void
  lastResult: number
};

/**
 * Provides a hook to manage user interaction with progress bars.
 *
 * @param {Object} props
 *        React props
 * @param {number} props.TICK_SPEED
 *        The tick speed of the visualization in ms
 */
export default function useVisProgressInter({
  TICK_SPEED,
}: {
  TICK_SPEED: number
}) {
  const [scrollLocked, setScrollLocked] = useState(false);

  // MouseDown/TouchStart event for progress bars
  function mouseDownProgress(
    event: React.MouseEvent | React.TouchEvent, low: number, high: number,
    round: number, callback: (val: number) => void,
  ) {
    const isTouch = Object.keys(event).includes('touches');
    const eventX = isTouch ?
      (event as React.TouchEvent).touches[0].clientX :
      (event as React.MouseEvent).clientX;

    if (!isTouch && (event as React.MouseEvent).button !== 0) return;

    let target = event.target as HTMLElement;
    while (!target.hasAttribute('data-parent')) {
      target = target.parentElement!;
    }

    const boundingRect = target.getBoundingClientRect();
    const left = boundingRect.left;
    const width = boundingRect.right - left;
    const x = eventX - left;
    const pct = x / width;
    const result = pct * (high - low) + low;
    const resultRounded = Math.round(result / round) * round;

    (target.children[0] as HTMLElement).style
      .setProperty('transition', 'none', 'important');

    progressDragData = {
      target, low, high, round, left, width, callback,
      lastResult: resultRounded,
    };

    if (isTouch) {
      addEventListener('touchmove', mouseMoveProgress);
      addEventListener('touchend', mouseUpProgress);
    } else {
      addEventListener('mousemove', mouseMoveProgress);
      addEventListener('mouseup', mouseUpProgress);
    }

    callback(resultRounded);
    event.preventDefault();
  }

  // MouseMove/TouchMove event for progress bars
  function mouseMoveProgress(event: MouseEvent | TouchEvent) {
    if (progressDragData === null) return;

    const eventX = (event instanceof TouchEvent) ?
      (event as TouchEvent).touches[0].clientX :
      (event as MouseEvent).clientX;

    const x = eventX - progressDragData.left;
    const pct = x / progressDragData.width;

    const result = pct * (
      progressDragData.high - progressDragData.low
    ) + progressDragData.low;

    const resultRounded = Math.round(
      result / progressDragData.round,
    ) * progressDragData.round;

    const resultClamped = Math.min(
      Math.max(resultRounded, progressDragData.low),
      progressDragData.high,
    );

    if (resultClamped === progressDragData.lastResult) return;

    progressDragData.lastResult = resultClamped;
    progressDragData.callback(resultClamped);
  }

  // MouseUp/TouchEnd event for progress bars
  function mouseUpProgress() {
    (progressDragData!.target.children[0] as HTMLElement).style
      .removeProperty('transition');
    progressDragData = null;

    removeEventListener('mousemove', mouseMoveProgress);
    removeEventListener('mouseup', mouseUpProgress);
    removeEventListener('touchmove', mouseMoveProgress);
    removeEventListener('touchend', mouseUpProgress);
  }

  function scrollLockProgress(
    e: React.WheelEvent,
    callback: (e: React.WheelEvent) => void,
    timeout: number,
  ) {
    if (scrollLocked) return;

    callback(e);

    setScrollLocked(true);
    setTimeout(() => setScrollLocked(false), TICK_SPEED * timeout);
  }

  return [
    mouseDownProgress,
    scrollLockProgress,
  ] as const;
}
