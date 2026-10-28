import { Typography } from '@material-tailwind/react';

import { type VisData } from '../../types';

import TableRoot from './table/TableRoot';

/**
 * Renders each step of the visualizer animation.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.data
 *        The internal state of the visualizer animation
 */
export default function VisRenderer(
  {
    data,
  }:
  {
    data: VisData
  },
) {
  switch (data.type) {
    case 'table':
      return <TableRoot data={data} />;

    default:
      return (
        <Typography type="h4" className="text-4xl! text-center opacity-25">
          Run the visualizer to see the animation
        </Typography>
      );
  }
}
