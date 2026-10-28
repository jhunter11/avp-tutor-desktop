import {
  useEffect,
  useState,
} from 'react';

import {
  type Step,
} from '../types';

import Globals from '../globals';

import useInterpreter from './useInterpreter';

/**
 * Provides a hook to load and read algorithm data.
 *
 * @param {Object} props
 *        React props
 * @param {function} props.setTitle
 *        A function to update the header title
 * @param {function} props.setLoaderHidden
 *        A function to update the loader hidden state
 */
export default function useAlgo(
  {
    setTitle,
    setLoaderHidden,
  }:
  {
    setTitle: (title: string) => void
    setLoaderHidden: (hidden: boolean) => void
  },
) {
  const [src, setSrc] = useState('');
  const [comp, setComp] = useState([] as Step[]);
  const [error, setError] = useState('');
  const [didLoad, setDidLoad] = useState(false);
  const [didCompile, setDidCompile] = useState(false);

  const [
    _,
    __,
    interpreterTrace,
    interpreterError,
  ] = useInterpreter(src);

  useEffect(() => {
    const algo = new URLSearchParams(window.location.search).get('algorithm');

    if (algo) {
      fetch(`${Globals.RouteBaseName}code/${algo}.avp`)
        .then(res => res.text())
        .then((text) => {
          const title = text.match(/\/\/ (.*)\r?\n/);

          if (title !== null) {
            setSrc(text.replace(/\/\/.*\r?\n\r?\n/, ''));
            setTitle(title[1]);
            setDidLoad(true);
          } else if (!error) {
            setError(`Failed to load algorithm '${algo}': Incorrect file format`);
          }
        })
        .catch(() => {
          if (error) return;
          setError(`Failed to load algorithm '${algo}': File not found`);
        });
    } else {
      setTitle('<unnamed>');
      setDidLoad(true);
      setDidCompile(true);
    }
  }, []);

  useEffect(() => {
    if (!error) return;

    setComp([{
      line: -1,
      actions: [],
    }]);
    setTitle(error);
    setSrc(error);

    setLoaderHidden(true);
  }, [error]);

  useEffect(() => {
    setLoaderHidden(didLoad && didCompile);
  }, [didLoad, didCompile]);

  useEffect(() => {
    if (!interpreterTrace) return;
    setDidCompile(false);

    if (interpreterError) {
      alert('Failed to compile algorithm!');
      setComp([{
        line: -1,
        actions: [],
      }]);
      setLoaderHidden(true);
      return;
    }

    setComp(JSON.parse(interpreterTrace));
    setDidCompile(true);
  }, [interpreterTrace]);

  return [
    src,
    setSrc,
    comp,
  ] as const;
}
