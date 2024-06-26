import React from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

export default function BottomUpModal({
  children,
  visible,
  setVisible,
}: {
  children: React.ReactNode
  visible: boolean
  setVisible: (visible: boolean) => void
}) {
  const backgroundVariants: Variants = {
    appear: {
      opacity: 1,
      transition: { when: 'beforeChildren' },
    },
    disappear: {
      opacity: 0,
      transition: { when: 'afterChildren' }
    }
  }

  const modalVariants: Variants = {
    up: { y: 0, opacity: 1 },
    down: { y: '50vh', opacity: 0 },
  }

  return <AnimatePresence>
    {visible ? (
      <motion.div
        onPointerUp={() => setVisible(false)}
        variants={backgroundVariants}
        initial='disappear'
        animate='appear'
        exit='disappear'
        className="fixed z-[99999] inset-0 backdrop-blur-sm flex flex-col justify-end items-stretch gap-2 bg-gray-800/20 p-3"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: .3, ease: 'easeIn' }}
          className="mx-24 h-1.5 rounded-full bg-gray-50/50 pointer-events-none"
        />
        <motion.div
          onPointerUp={e => e.stopPropagation()}
          variants={modalVariants}
          initial='down'
          animate='up'
          exit='down'
          transition={{ duration: .4, ease: 'easeOut' }}
          className="w-full max-h-[80%] min-h-[10%] bg-gray-50/95 rounded-3xl overflow-y-auto scrollbar-hide mb-safe"
        >
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
}
