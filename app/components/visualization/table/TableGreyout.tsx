/**
 * Renders a greyout mark for the table visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.idx
 *        The index to render the greyout at
 */
export default function TableGreyout(
  {
    idx,
  }:
  {
    idx: string
  },
) {
  return (
    <div className="h-0 overflow-visible">
      <div
        style={{
          transform: `translateX(${6.125 * parseInt(idx)}rem)`,
        }}
        className="w-24 h-24 bg-[#d8d8dc] dark:bg-[#38383c] opacity-50"
      />
    </div>
  );
}
