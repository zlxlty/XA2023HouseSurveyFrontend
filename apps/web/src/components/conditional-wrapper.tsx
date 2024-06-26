export default function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: JSX.Element) => JSX.Element
  children: JSX.Element
}) {
  return condition ? wrapper(children) : children
}
