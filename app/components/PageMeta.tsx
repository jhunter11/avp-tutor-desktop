import Globals from '../globals';

/**
 * Provisions page metadata.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.title
 *        The title of the page
 * @param {string} props.description
 *        The description of the page
 */
export default function PageMeta(
  {
    title,
    description,
  }:
  {
    title: string
    description: string
  },
) {
  return (
    <>
      <title>
        {`${Globals.AppName} | ${title}`}
      </title>
      <meta
        property="og:title"
        content={`${Globals.AppName} | ${title}`}
      />

      <meta
        name="description"
        content={description}
      />
      <meta
        property="og:description"
        content={description}
      />
    </>
  );
}
