import useResolveColor from '../../../hooks/useResolveColor';

/**
 * Renders an outline mark for the table visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.idx
 *        The index to render the outline at
 * @param {Object} props.val
 *        The outline data to render
 */
export default function TableOutline(
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
      <div
        style={{
          outlineColor: resolveColor(
            val.color,
            val.type,
          ),
          transform: `translateX(${6.125 * parseInt(idx)}rem)`,
        }}
        className="w-24 h-24 rounded-md outline-4"
      />
    </div>
  );
}
