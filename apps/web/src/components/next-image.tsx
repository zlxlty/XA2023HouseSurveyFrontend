import clsx from 'clsx'

export default function Image({
  priority: _,
  ...props
}: JSX.IntrinsicElements['img'] & {
  /** @deprecated This value does not have any effect anymore. */
  priority?: boolean

  src: string | { src: string }
}) {
  return (
    <img
      {...props}
      draggable="false"
      className={clsx('select-none', props.className)}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
      }}
    />
  )
}
