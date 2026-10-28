/**
 * A flex component that takes up all available space in its parent element.
 * Useful for separating elements at the start and end of a flex container.
 *
 * @param {Object} props
 *        React props
 * @param {string} props.className
 *        Extra classes to apply
 */
export default function FlexSpacer(
  {
    className,
  }:
  {
    className?: string
  },
) {
  return <div role="presentation" className={`inline-block grow ${className}`} />;
}
