import Monaco from '../Monaco';

/**
 * Renders the vars pane for the visualizer.
 *
 * @param {Object} props
 *        React props
 * @param {Object} props.vars
 *        The variables to display
 */
export default function VarsPane(
  {
    vars,
  }:
  {
    vars: { [key: string]: [any, number] }
  },
) {
  return (
    <div className="w-full h-full" data-tutor-capture="Variables">
      <Monaco
        name="vars"
        src={
          Object.keys(vars)
            .map(key => `${key}: ${
              (JSON.stringify(vars[key][0]) || `ERROR`)
                .replaceAll(',', ', ')
                .replaceAll('"<function>"', '<function>')
            }`)
            .join('\n')
        }
        setSrc={(_: string) => {}}
        highlights={
          Object.keys(vars)
            .map((key, idx) => [idx, vars[key][1]])
            .filter(key => key[1] > 0)
            .map(key => key[0] + 1)
        }
        greyouts={
          Object.keys(vars)
            .map((key, idx) => [idx, vars[key][1]])
            .filter(key => key[1] < 0)
            .map(key => key[0] + 1)
        }
        editing={false}
        bindSrc={true}
      />
    </div>
  );
}
