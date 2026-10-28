import { Typography } from '@material-tailwind/react';

import { type VisData } from '../../../types';

/**
 * Renders the base layout of the 'table' visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.data
 *        The internal state of the visualizer animation
 */
export default function TableBase(
  {
    data,
  }:
  {
    data: VisData
  },
) {
  return (
    <div className="flex rounded-md overflow-hidden outline-2 outline-[#d8d8dc] dark:outline-[#38383c] gap-0.5">
      {
        data.data.map((val, idx) => (
          <div
            key={idx}
            className="w-24 h-24 bg-[#ffffff] dark:bg-[#18181c] outline-2 outline-[#d8d8dc] dark:outline-[#38383c]"
          >
            <Typography
              type="h4"
              className="text-4xl! text-center relative top-1/2 -translate-y-1/2"
            >
              {val}
            </Typography>
          </div>
        ))
      }
    </div>
  );
}
