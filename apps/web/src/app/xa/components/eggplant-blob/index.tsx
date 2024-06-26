import { clsx } from 'clsx'
import styles from './index.module.css'
import { motion, type Variant } from 'framer-motion'
import { useMemo } from 'react'

const MAX_SIZE = 3.5

const zoomVariant: Variant = {
  scale: 100,
  translateX: '50%',
  translateY: '50%',
  transition: { duration: 1 },
}

export default function Eggplant({
  progress,
  className,
}: {
  progress: number
  className: string
}) {
  const baseVariant = useMemo<Variant>(
    () => ({
      scale: progress * (MAX_SIZE - 1) + 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    }),
    [progress],
  )

  return (
    <motion.div
      variants={{ zoomVariant, baseVariant }}
      initial="baseVariant"
      animate={progress >= 0 ? 'baseVariant' : 'zoomVariant'}
      className={className}
    >
      <div className={clsx(styles.eggplant, 'w-full h-full')} />
    </motion.div>
  )
}
