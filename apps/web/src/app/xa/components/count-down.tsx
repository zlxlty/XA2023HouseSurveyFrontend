import React, { useState, useEffect, useMemo, useRef } from 'react'
import dayjs from "dayjs"
import duration from 'dayjs/plugin/duration'
import { motion, useSpring, AnimatePresence, type Variants } from 'framer-motion'
import { CursorArrowRaysIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

const COUNTDOWN = '2023-07-29T05:56:50.000Z'

dayjs.extend(duration)
const getInitTime = () => dayjs.duration(dayjs(COUNTDOWN).diff(dayjs()))

const variants: Variants = {
  init: {
    opacity: 0
  },
  countdown: {
    opacity: 1,
    transition: { duration: 0.5, delay: 2 }
  },
  text1: {
    opacity: .5,
    transition: { delay: 0.5 }
  },
  text2: {
    opacity: .8,
    transition: { delay: 1 }
  },
  text3: {
    opacity: 1,
    transition: { delay: 1.5 }
  },
  fade: {
    opacity: 0,
    transition: { duration: .4 }
  },
  shrink: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.3 }
  },
}

enum Step {
  start = 0,
  showButton,
  holyTime,
}

export default function Countdown({ onClick }: { onClick: () => void }) {
  const [timeRemaining, setTimeRemaining] = useState(getInitTime())
  const [step, setStep] = useState(Step['start'])

  const x = useSpring(innerWidth / 2, { stiffness: 350, damping: 40 })
  const y = useSpring(innerHeight / 2, { stiffness: 350, damping: 40 })

  const remainingTime = useMemo(() => {
    const hours = formatWithPadding(timeRemaining.asHours(), 3)
    const minutes = formatWithPadding(timeRemaining.minutes(), 2)
    const seconds = formatWithPadding(timeRemaining.seconds(), 2)
    return hours + ':' + minutes + ':' + seconds
  }, [timeRemaining])

  useEffect(() => {
    // if (step !== Step['holyTime']) return
    const timer = setInterval(() => {
      setTimeRemaining(getInitTime())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [step])

  function handleMouseMove({ clientX, clientY }: React.MouseEvent<HTMLElement>) {
    x.set(clientX)
    y.set(clientY)
  }

  function handleMouseClick() {
    onClick()
    setStep(Step['holyTime'])
  }

  return (
    <>
      <section className={clsx(
        { 'opacity-0': step < Step['holyTime'] },
        'pointer-events-none duration-[15s] delay-200'
      )}
      >
        <FlowingBackground />
      </section>
      <main
        onMouseMove={handleMouseMove}
        className={clsx({ 'bg-black': step >= Step['holyTime'] },
          'w-full h-full p-28 cursor-none duration-500 delay-700'
        )}
        onClick={handleMouseClick}
      >
        <div className='w-full h-full grid place-items-center' >
          <section className='w-full h-full flex flex-col justify-between text-9xl whitespace-pre-line leading-relax'>
            <div className='flex justify-between text-gray-800'>
              <motion.span
                variants={variants}
                initial="init"
                animate={step >= Step['holyTime'] ? "fade" : "text1"}
                className='scale-150 origin-top-left' style={{ writingMode: 'vertical-lr' }}
              >距离</motion.span>
              <motion.span
                variants={variants}
                initial="init"
                animate={step >= Step['holyTime'] ? "fade" : "text3"}
                onAnimationComplete={() => step >= Step['holyTime'] || setStep(Step['showButton'])}
                className='scale-[1.8] origin-top-right'
              >还剩</motion.span>
            </div>
            <motion.span
              variants={variants}
              initial="init"
              animate={step >= Step['holyTime'] ? "fade" : "text2"}
              className='self-end'
            >时空探索者抵达,</motion.span>
          </section>
          <motion.section
            variants={variants}
            initial="init"
            animate={step >= Step['holyTime'] ? "countdown" : 'init'}
            className="text-gray-50 fixed inset-0 flex justify-center items-center font-neox text-8xl tracking-widest">
            {remainingTime
              .split('')
              .map((item, index) => <MeasuredTextWith0 key={index + item} text={item} />)
            }

          </motion.section>
        </div>
        <AnimatePresence mode='wait' presenceAffectsLayout>
          {
            step === Step['showButton'] ? (
              <motion.div
                variants={variants}
                initial='init'
                animate={{ opacity: 1 }}
                exit='shrink'
                style={{ x, y }}
                className='grid place-content-center absolute -top-6 -left-6 w-12 aspect-square ring-8 ring-gray-800/10 backdrop-blur rounded-full z-50 bg-gray-800/70'
              >
                <CursorArrowRaysIcon className='w-6 h-6 text-gray-50 animate-pulse' />
              </motion.div>
            ) : null}
        </AnimatePresence>
        <motion.div
          variants={variants}
          initial="init"
          animate={step >= Step['holyTime'] ? "text3" : 'init'}
          className='absolute left-1/2 bottom-10 -translate-x-1/2 z-50 font-neox text-gray-50 text-5xl'>
          X
        </motion.div>
      </main>
    </>
  )
}

function formatWithPadding(num: number, digit: number) {
  const fixedNum = num.toFixed()
  const remainDigit = digit - fixedNum.length
  if (remainDigit <= 0) return fixedNum
  return '0'.repeat(remainDigit) + fixedNum
}

function MeasuredTextWith0({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: .1 }}
      className='grid place-content-center w-[5.5rem]'
    >{text}
    </motion.span>
  )
}

function FlowingBackground() {
  const [opacity, setOpacity] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {

    const intervalId = setInterval(() => {
      if (!videoRef.current) return

      const { currentTime, duration } = videoRef.current
      setOpacity(1 - Math.abs(currentTime - duration / 2) / (duration / 2))
    }, 40)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <video
      ref={videoRef}
      src='/bg-video.mp4'
      loop
      muted
      autoPlay
      style={{ opacity }}
      className="fixed w-full h-full brightness-75 object-cover"
    />
  )
}