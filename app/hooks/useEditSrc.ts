import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to edit a state variable with save and discard functions.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.src
 *        The source state variable
 * @param {function} props.setSrc
 *        A function to update the source state variable
 * @param {function} props.onSave
 *        A function to run on save
 * @param {function} props.onDiscard
 *        A function to run on discard
 */
export default function useEditSrc({
  src,
  setSrc,
  onSave,
  onDiscard,
}:
{
  src: string
  setSrc: (src: string) => void
  onSave: () => void
  onDiscard: () => void
}) {
  const [editSrc, setEditSrc] = useState('');

  useEffect(() => {
    setEditSrc(src);
  }, [src]);

  function save() {
    setSrc(editSrc);
    onSave();
  }

  function discard() {
    setEditSrc(src);
    onDiscard();
  }

  return [
    editSrc,
    setEditSrc,
    save,
    discard,
  ] as const;
}
