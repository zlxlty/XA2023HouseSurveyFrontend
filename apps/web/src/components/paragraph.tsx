import clsx from 'clsx'
import { useMemo } from 'react'

export default function Paragraph(
  { content, className }: { content?: string, className?: string }
) {
  const segments = useMemo(() => {
    return content?.split('\n') || []
  }, [content])
  return (
    <>
      {segments.map((segment, index) => {
        return (
          <span key={`${segment}+${index}`} className={clsx('mb-0.5 block', className)}>
            {segment}
          </span>
        )
      })}
    </>
  )
}
