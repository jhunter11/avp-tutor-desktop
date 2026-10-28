import { Typography } from '@material-tailwind/react';

import useResolveColor from '../../../hooks/useResolveColor';

/**
 * Renders a text mark for the table visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.idx
 *        The index to render the text at
 * @param {Object} props.val
 *        The text data to render
 */
export default function TableText(
  {
    idx,
    val,
  }:
  {
    idx: string
    val: {
      value: string
      color: string
      type: string
    }
  },
) {
  const [resolveColor] = useResolveColor();

  return (
    <div className="h-0 overflow-visible">
      <Typography
        type="h4"
        className="text-2xl! font-medium text-center relative top-28"
        style={{
          color: resolveColor(
            val.color,
            val.type,
          ),
          transform: `translateX(calc(${6.125 * parseInt(idx)}rem - 50% + 3rem))`,
        }}
      >
        {val.value}
      </Typography>
    </div>
  );
}
