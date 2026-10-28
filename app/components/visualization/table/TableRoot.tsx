import { type VisData } from '../../../types';

import TableBase from './TableBase';
import TableText from './TableText';
import TableOutline from './TableOutline';
import TableHighlight from './TableHighlight';
import TableGreyout from './TableGreyout';

/**
 * Renders the root layout of the 'table' visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.data
 *        The internal state of the visualizer animation
 */
export default function TableRoot(
  {
    data,
  }:
  {
    data: VisData
  },
) {
  return (
    <>
      <div className="h-0 overflow-visible relative z-10">
        {
          Object.keys(data.marks).map(idx => (
            data.marks[idx].map((val) => {
              switch (val.type) {
                case 'outline':
                  return <TableOutline idx={idx} val={val} />;
                case 'highlight':
                  return <TableHighlight idx={idx} val={val} />;
                case 'greyout':
                  return <TableGreyout idx={idx} />;
                case 'text':
                  return <TableText idx={idx} val={val} />;
                default:
                  return <></>;
              }
            })
          ))
        }
      </div>
      <TableBase data={data} />
    </>
  );
}
