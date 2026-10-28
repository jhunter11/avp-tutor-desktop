import useResolveColor from '../../../hooks/useResolveColor';

/**
 * Renders a highlight mark for the table visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.idx
 *        The index to render the highlight at
 * @param {Object} props.val
 *        The highlight data to render
 */
export default function TableHighlight(
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
          backgroundColor: resolveColor(
            val.color,
            val.type,
          ),
          transform: `translateX(${6.125 * parseInt(idx)}rem)`,
        }}
        className="w-24 h-24 opacity-25"
      />
    </div>
  );
}
