import {
  IconButton,
  Progress,
  Typography,
} from '@material-tailwind/react';

import {
  UndoAction,
  Forward,
  Minus,
  NavArrowLeft,
  NavArrowRight,
  Pause,
  Play,
  Plus,
  PrecisionTool,
  Rewind,
} from 'iconoir-react';

import useVisAdjust from '../../hooks/useVisAdjust';
import useVisPan from '../../hooks/useVisPan';
import useVisProgressInter from '../../hooks/useVisProgressInter';
import useStepTimer from '../../hooks/useStepTimer';

/**
 * Renders the main visualization frame around the passed child elements.
 * Provides step, view, and zoom controls to control and resize contents.
 *
 * @param {Object} props
 *        React props
 * @param {number} props.numSteps
 *        The number of steps in the visualization
 * @param {number} props.stepNum
 *        The current step number
 * @param {function} props.prevStep
 *        A function to go to the previous step
 * @param {function} props.nextStep
 *        A function to go to the next step
 * @param {function} props.setStepNum
 *        A function to update the step number directly
 * @param {function} props.reset
 *        A function to reset the visualization
 * @param {React.ReactNode} props.children
 *        Child elements
 */
export default function VisFrame(
  {
    numSteps,
    stepNum,
    prevStep,
    nextStep,
    setStepNum,
    reset,
    children,
  }:
  {
    numSteps: number
    stepNum: number
    prevStep: () => void
    nextStep: () => void
    setStepNum: (num: number) => void
    reset: () => void
    children: React.ReactNode
  },
) {
  const [
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
  ] = useVisAdjust();

  const [
    offsetX,
    setOffsetX,
    offsetY,
    setOffsetY,
    dragging,
    mouseDown,
  ] = useVisPan({ zoom, setZoom, MIN_ZOOM, MAX_ZOOM });

  const [
    time,
    setTime,
    TICK_SPEED,
  ] = useStepTimer({ speed, numSteps, stepNum, nextStep });

  const [
    mouseDownProgress,
    scrollLockProgress,
  ] = useVisProgressInter({ TICK_SPEED });

  return (
    <section className="w-full h-full" data-tutor-capture="Visualization">
      <div className="flex gap-1 items-center relative w-full h-0 overflow-visible px-2 justify-end z-20 translate-y-7 portrait:justify-center">
        <IconButton
          variant="ghost"
          aria-label={`${time > 0 ? 'Pause' : 'Play'} Animation`}
          title={`${time > 0 ? 'Pause' : 'Play'} Animation`}
          onClick={() => {
            setTime(time > 0 ? 0 : TICK_SPEED);
          }}
          className="cursor-pointer"
        >
          {
            time > 0 ?
              <Pause className="stroke-2 w-6 h-6" role="presentation" /> :
              <Play className="stroke-2 w-6 h-6" role="presentation" />
          }

        </IconButton>
        <div className="w-64 max-w-full mx-0.5">
          <Progress
            value={stepNum / numSteps * 100}
            onWheel={
              e => scrollLockProgress(e, (e) => {
                if ((e.deltaY > 0)) {
                  prevStep();
                } else if ((e.deltaY < 0)) {
                  nextStep();
                }
              }, (50 / numSteps))
            }
            onMouseDownCapture={
              e => mouseDownProgress(e, 0, numSteps, 1, setStepNum)
            }
            onTouchStartCapture={
              e => mouseDownProgress(e, 0, numSteps, 1, setStepNum)
            }
            data-parent
            className="rounded-lg h-8 w-full border border-[#d8d8dc] dark:border-[#38383c] bg-[#ffffff] dark:bg-[#18181c]"
          >
            <Progress.Bar className="bg-[dodgerblue]" />
          </Progress>
          <Typography className="text-base font-medium pointer-events-none relative text-center w-full h-0 overflow-visible z-30 -translate-y-7">
            {`Step: ${stepNum} / ${numSteps}`}
          </Typography>
        </div>
        <IconButton
          variant="ghost"
          aria-label="Step Backward"
          title="Step Backward"
          onClick={prevStep}
          className="cursor-pointer"
        >
          <NavArrowLeft className="stroke-2 w-6.5 h-6.5" role="presentation" />
        </IconButton>
        <IconButton
          variant="ghost"
          aria-label="Step Forward"
          title="Step Forward"
          onClick={nextStep}
          className="cursor-pointer"
        >
          <NavArrowRight className="stroke-2 w-6.5 h-6.5" role="presentation" />
        </IconButton>
        <IconButton
          variant="ghost"
          aria-label="Reset"
          title="Reset"
          onClick={() => {
            setTime(0);
            reset();
          }}
          className="cursor-pointer"
        >
          <UndoAction className="stroke-2 w-6 h-6" role="presentation" />
        </IconButton>
      </div>

      <div className="flex flex-col w-full h-full">
        <div
          onContextMenuCapture={e => e.preventDefault()}
          onWheel={(e) => {
            if (zoom === null) return;

            if ((e.deltaY > 0) && (zoom * 0.95 >= MIN_ZOOM)) {
              setZoom(zoom * 0.95);
              setOffsetX(offsetX * 0.95);
              setOffsetY(offsetY * 0.95);
            } else if ((e.deltaY < 0) && (zoom * 1.05 <= MAX_ZOOM)) {
              setZoom(zoom * 1.05);
              setOffsetX(offsetX * 1.05);
              setOffsetY(offsetY * 1.05);
            }
          }}
          onMouseDownCapture={mouseDown}
          onTouchStartCapture={mouseDown}
          style={{
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          className="w-full grow overflow-hidden"
        >
          <div
            style={{
              '--zoom': `${zoom}`,
              '--offset-x': `${offsetX}px`,
              '--offset-y': `${offsetY}px`,
            } as React.CSSProperties}
            className="relative z-10 pointer-events-none transition-none! w-min h-min top-1/2 left-1/2 translate-x-[calc(-50%+var(--offset-x))] translate-y-[calc(-50%+var(--offset-y))] scale-(--zoom)"
          >
            {children}
          </div>
        </div>

        {
          (offsetX !== 0.0 || offsetY !== 0.0) && (
            <div className="flex items-center w-full h-0 overflow-visible px-2 z-20 relative justify-start -translate-y-7 portrait:absolute portrait:justify-end portrait:-translate-y-7 portrait:-translate-x-10.5">
              <IconButton
                variant="ghost"
                aria-label="Re-center View"
                title="Re-center View"
                onClick={() => {
                  setOffsetX(0.0);
                  setOffsetY(0.0);
                }}
                className="opacity-50 hover:opacity-100 focus-visible:opacity-100 active:opacity-100 transition-opacity cursor-pointer"
              >
                <PrecisionTool className="stroke-2 w-6 h-6 -scale-x-100" role="presentation" />
              </IconButton>
            </div>
          )
        }

        <div className="flex gap-1 items-center relative w-full h-0 overflow-visible px-2 justify-end z-20 -translate-y-7 portrait:justify-center">
          <div className="w-64 max-w-full mx-0.5">
            <Progress
              value={
                (
                  SPEEDS.findIndex(
                    s => s == DEFAULT_SPEED / (speed || DEFAULT_SPEED),
                  ) + 1
                ) / 18 * 100
              }
              onWheel={
                e => scrollLockProgress(e, (e) => {
                  if (speed === null) return;

                  if ((e.deltaY > 0)) {
                    setSpeed(getNextSpeed(speed, -1));
                  } else if ((e.deltaY < 0)) {
                    setSpeed(getNextSpeed(speed, 1));
                  }
                }, 5)
              }
              onMouseDownCapture={
                e => mouseDownProgress(e, 0, 17, 1, setSpeedInt)
              }
              onTouchStartCapture={
                e => mouseDownProgress(e, 0, 17, 1, setSpeedInt)
              }
              data-parent
              className="rounded-lg h-8 w-full border border-[#d8d8dc] dark:border-[#38383c] bg-[#ffffff] dark:bg-[#18181c]"
            >
              <Progress.Bar className="bg-[dodgerblue]" />
            </Progress>
            <Typography className="text-base font-medium pointer-events-none relative text-center w-full h-0 overflow-visible z-30 -translate-y-7">
              {`Speed: ${DEFAULT_SPEED / (speed || DEFAULT_SPEED)}x`}
            </Typography>
          </div>
          <IconButton
            variant="ghost"
            aria-label="Decrease Speed"
            title="Decrease Speed"
            onClick={() => setSpeed(getNextSpeed((speed || DEFAULT_SPEED), -1))}
            className="cursor-pointer"
          >
            <Rewind className="stroke-2 w-5.5 h-5.5" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Increase Speed"
            title="Increase Speed"
            onClick={() => setSpeed(getNextSpeed((speed || DEFAULT_SPEED), 1))}
            className="cursor-pointer"
          >
            <Forward className="stroke-2 w-5.5 h-5.5" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Reset Speed"
            title="Reset Speed"
            onClick={() => setSpeed(DEFAULT_SPEED)}
            className="cursor-pointer"
          >
            <UndoAction className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
        </div>

        <div className="flex gap-1 items-center justify-end p-2 border-[#d8d8dc] dark:border-[#38383c] border-t bg-[#ffffff] dark:bg-[#18181c] portrait:justify-center">
          <div className="w-64 max-w-full mx-0.5">
            <Progress
              value={(zoom || DEFAULT_ZOOM) / 5 * 100}
              onWheel={
                e => scrollLockProgress(e, (e) => {
                  if (zoom === null) return;

                  if ((e.deltaY > 0) && (zoom - 0.1 >= MIN_ZOOM)) {
                    setZoom(zoom - 0.1);
                  } else if ((e.deltaY < 0) && (zoom + 0.1 <= 5.0)) {
                    setZoom(zoom + 0.1);
                  }
                }, 4)
              }
              onMouseDownCapture={
                e => mouseDownProgress(e, 0, 5, 0.1, setZoom)
              }
              onTouchStartCapture={
                e => mouseDownProgress(e, 0, 5, 0.1, setZoom)
              }
              data-parent
              className="rounded-lg h-8 w-full border border-[#d8d8dc] dark:border-[#38383c] bg-[#ffffff] dark:bg-[#18181c]"
            >
              <Progress.Bar className="bg-[dodgerblue]" />
            </Progress>
            <Typography className="text-base font-medium pointer-events-none relative text-center w-full h-0 overflow-visible z-30 -translate-y-7">
              {`Zoom: ${Math.round((zoom || DEFAULT_ZOOM) * 100)}%`}
            </Typography>
          </div>
          <IconButton
            variant="ghost"
            aria-label="Zoom Out"
            title="Zoom Out"
            onClick={() => setZoom(
              ((zoom || DEFAULT_ZOOM) - 0.1 >= MIN_ZOOM) ?
                (zoom || DEFAULT_ZOOM) - 0.1 :
                MIN_ZOOM,
            )}
            className="cursor-pointer"
          >
            <Minus className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Zoom In"
            title="Zoom In"
            onClick={() => setZoom(
              ((zoom || DEFAULT_ZOOM) + 0.1 <= MAX_ZOOM) ?
                (zoom || DEFAULT_ZOOM) + 0.1 :
                MAX_ZOOM,
            )}
            className="cursor-pointer"
          >
            <Plus className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Reset Zoom"
            title="Reset Zoom"
            onClick={() => setZoom(DEFAULT_ZOOM)}
            className="cursor-pointer"
          >
            <UndoAction className="stroke-2 w-6 h-6" role="presentation" />
          </IconButton>
        </div>
      </div>
    </section>
  );
}
