import {
  IconButton,
  Typography,
} from '@material-tailwind/react';

import {
  Check,
  Xmark,
  EditPencil,
  NavArrowDown,
  NavArrowUp,
} from 'iconoir-react';

import FlexSpacer from '../FlexSpacer';

/**
 * Renders the header for each sidebar pane.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.title
 *        The title of the pane
 * @param {boolean | undefined} props.editing
 *        Whether the pane is in editing mode
 * @param {function | undefined} props.setEditing
 *        A function to update the editing state
 * @param {function | undefined} props.save
 *        A function to save the changes
 * @param {function | undefined} props.discard
 *        A function to discard the changes
 * @param {number | null} props.paneHeight
 *        The height in px of the pane
 * @param {function} props.setPaneHeight
 *        A function to update the height of the pane
 * @param {number} props.defaultPaneHeight
 *        The default height in px of a pane
 * @param {number} props.minPaneHeight
 *        The minimum height in px of a pane
 */
export default function PaneHeader(
  {
    title,
    editing,
    setEditing,
    save,
    discard,
    paneHeight,
    setPaneHeight,
    defaultPaneHeight,
    minPaneHeight,
  }:
  {
    title: string
    editing: boolean | undefined
    setEditing: ((editing: boolean) => void) | undefined
    save: (() => void) | undefined
    discard: (() => void) | undefined
    paneHeight: number | null
    setPaneHeight: (height: number) => void
    defaultPaneHeight: number
    minPaneHeight: number
  },
) {
  return (
    <header className="flex flex-row items-center border-b border-[#d8d8dc] dark:border-[#38383c] px-1 py-0.5">
      <Typography
        type="h3"
        className="text-base! font-medium ml-2"
      >
        {title}
      </Typography>

      <FlexSpacer />

      {
        (editing !== undefined) && (
          editing ?
            (
              <>
                <IconButton
                  variant="ghost"
                  aria-label={`Save changes to ${title}`}
                  title="Save changes"
                  onClick={save}
                  className="cursor-pointer"
                >
                  <Check className="stroke-2 w-5 h-5" role="presentation" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  aria-label={`Discard changes to ${title}`}
                  title="Discard changes"
                  onClick={discard}
                  className="cursor-pointer"
                >
                  <Xmark className="stroke-2 w-5 h-5" role="presentation" />
                </IconButton>
              </>
            ) :
            (
              <IconButton
                variant="ghost"
                aria-label={`Edit ${title}`}
                title={`Edit ${title}`}
                onClick={() => setEditing!(true)}
                className="cursor-pointer"
              >
                <EditPencil className="stroke-2 w-5 h-5" role="presentation" />
              </IconButton>
            )
        )
      }
      <IconButton
        variant="ghost"
        aria-label={`${(paneHeight === minPaneHeight) ? 'Expand' : 'Collapse'} ${title} Pane`}
        title={`${(paneHeight === minPaneHeight) ? 'Expand' : 'Collapse'} ${title} Pane`}
        onClick={() => setPaneHeight(
          (paneHeight === minPaneHeight) ?
            defaultPaneHeight :
            minPaneHeight,
        )}
        className="cursor-pointer"
      >
        {
          (paneHeight === minPaneHeight) ?
            <NavArrowUp className="stroke-2 w-5 h-5" role="presentation" /> :
            <NavArrowDown className="stroke-2 w-5 h-5" role="presentation" />
        }
      </IconButton>
    </header>
  );
}
