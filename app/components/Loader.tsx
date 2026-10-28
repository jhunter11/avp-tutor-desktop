import { Typography } from '@material-tailwind/react';

/**
 * Renders a loading overlay to be used by the visualizer while it loads.
 *
 * @param {Object} props
 *        React props
 * @param {boolean} props.hidden
 *        Whether the loading overlay should be hidden
 */
export default function Visualizer(
  {
    hidden,
  }:
  {
    hidden: boolean
  },
) {
  return (
    <div className={`${hidden ? 'hidden ' : ''}flex flex-col justify-center items-center w-screen h-screen opacity-75 absolute top-0 left-0 bg-[#d8d8dc] dark:bg-[#38383c] z-50`}>
      <div className="w-16 h-16 rounded-full border-6 border-primary border-t-transparent animate-spin duration-1000!"></div>
      <Typography
        type="h1"
        className="text-lg! font-medium ml-2 mt-4"
      >
        Loading...
      </Typography>
    </div>
  );
}
