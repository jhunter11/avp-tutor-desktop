import { useState } from 'react';
import { Button } from '@material-tailwind/react';

import useInterpreter from '../hooks/useInterpreter';

// Updated sample code with mandatory 'arr' syntax and function call
const sampleCode = `a1 = arr[1, 10, 5, 6, 4, 7, 19]
key = 4

fun Linear_Search(a, k):
    for n in a:
        if n == k:
            return n
        end if
    end for
    return -1
end fun

Linear_Search(a1, key)`;

/**
 * TODO: THIS IS A TEST PAGE! DELETE IN PRODUCTION!
 */
export default function Interp() {
  const [pseudocode, setPseudocode] = useState(sampleCode);
  const [viewMode, setViewMode] = useState('js');

  const [js, tree, trace, error] = useInterpreter(pseudocode);

  return (
    <div className="overflow-y-scroll max-h-screen">
      <div>
        <h2>Input Pseudocode</h2>
        <textarea
          value={pseudocode}
          onChange={e => setPseudocode(e.target.value)}
          spellCheck="false"
        />
      </div>
      <div>
        <h2>Output</h2>
        <div>
          <Button onClick={() => setViewMode('js')}>JavaScript</Button>
          <Button onClick={() => setViewMode('tree')}>Parse Tree</Button>
          <Button onClick={() => setViewMode('trace')}>Execution Trace</Button>
        </div>
      </div>
      <pre>
        {
          error ?
            error :
            (
              (viewMode === 'js') ?
                js :
                (
                  (viewMode === 'tree') ?
                    tree :
                    trace
                )
            )
        }
      </pre>
    </div>
  );
}
