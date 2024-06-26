export function InfiniteTagScroll({
  tags,
  rows = 3,
  tagPerRow = 15,
  duration = 30000,
}: {
  tags: string[]
  rows?: number
  tagPerRow?: number
  duration?: number
}) {
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min
  const shuffle = (arr: any[]) => [...arr].sort(() => 0.5 - Math.random())

  const InfiniteLoopSlider = ({
    children,
    duration,
    reverse = 0,
  }: {
    children: React.ReactNode
    duration: number
    reverse: number
  }) => {
    return (
      <div
        className="infinite-loop-slider"
        style={
          {
            '--duration': `${duration}ms`,
            '--direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        <div className="inner">
          {children}
          {children}
        </div>
      </div>
    )
  }

  const Tag = ({ text }: { text: string }) => (
    <div className="ui-min-w-fit ui-flex ui-items-center ui-gap-x-1 ui-text-gray-500 ui-text-xs ui-bg-white ui-rounded-2xl ui-px-4 ui-py-3 ui-mr-4 ui-shadow-neumorphism">
      <span className="text-xl">#</span>
      {text}
    </div>
  )

  return (
    <div className="ui-flex ui-flex-col ui-flex-shrink-0 ui-gap-y-4 ui-relative ui-py-6 ui-overflow-hidden ui-justify-around">
      {[...new Array(rows)].map((_, i) => (
        <InfiniteLoopSlider
          key={i}
          duration={random(duration - 5000, duration + 5000)}
          reverse={i % 2}
        >
          {shuffle(tags)
            .slice(0, tagPerRow)
            .map((tag, i) => (
              <Tag text={tag} key={i} />
            ))}
        </InfiniteLoopSlider>
      ))}
      <div className="ui-pointer-events-none ui-absolute ui-inset-0" />
    </div>
  )
}
