import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import clsx from 'clsx'
import useSWRImmutable from 'swr/immutable'
import QAPair from './components/qa-pair'
import type { QAPairConfig, Message } from './types'
import BoxLoading from '#/components/box-loading'
import Eggplant from './components/eggplant-blob'
import NextImage from '#/components/next-image'
import { useTitle } from '#/utils/useTitle'
import LC from 'leancloud-storage'
import toast from 'react-hot-toast'
import Countdown from './components/count-down'
import ComputerDesktopIcon from '@heroicons/react/24/outline/ComputerDesktopIcon'
import { isDesktop, isTablet } from 'react-device-detect'

const min_height = 750

export default function Page() {
  useTitle('时空探索者计划交互入口')

  const template = 'xa-sorting'

  const User = LC.User.current()

  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [chatPageCount, setChatPageCount] = useState(1)
  const [answerCount, setAnswerCount] = useState(0)
  const [skipToFinish, setSkipToFinish] = useState(false)
  const [showEggplant, setShowEggplant] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)

  const x = useSpring(100, { stiffness: 300, damping: 40 })
  const y = useSpring(100, { stiffness: 300, damping: 40 })
  const [pureXY, setPureXY] = useState({
    x: innerWidth / 2,
    y: innerHeight / 2,
  })

  const { data: chatPageQuestionsList } = useSWRImmutable(
    User ? 'smart-profile-input' : null,
    chatPageQuestionsListFetcher,
  )

  const totalQuestionsLength = useMemo(
    () => (chatPageQuestionsList ? chatPageQuestionsList.flat().length : null),
    [chatPageQuestionsList],
  )

  const isAllFinished = useMemo(
    () =>
      (totalQuestionsLength && totalQuestionsLength * 2 <= messages.length) ||
      skipToFinish,
    [chatPageQuestionsList, messages, skipToFinish],
  )

  const { data: showCountDown } = useSWRImmutable(
    'count-down' + User + isAllFinished,
    async () => {
      if (!User.id) return null
      if (isAllFinished) return true
      const UserQuery = await new LC.Query('_User').get(User.id)
      return UserQuery.get('XAProfileCompleted')
    },
  )

  useEffect(() => {
    if (!isAllFinished) return

    uploadResultsToLC().then(async () => {
      await setXAProfileCompletedToLC()
    })

    setTimeout(() => setShowEggplant(false), 1000)

    async function uploadResultsToLC() {
      if (!chatPageQuestionsList) return
      if (!User.id) {
        toast.error('请先登录')
        return
      }

      const XAProfile = new LC.Object('XASortingProfile')

      try {
        await XAProfile.set('User', User)
          .set('conversations', JSON.stringify(messages))
          .save()
        toast('信息上传成功！')
      } catch {
        toast.error('网络有问题，请刷新重新填写', {
          duration: Infinity,
        })
      }
    }

    async function setXAProfileCompletedToLC() {
      if (!User.id) return

      const UserQuery = await new LC.Query('_User').get(User.id)
      await UserQuery.set('XAProfileCompleted', true).save()
    }
  }, [isAllFinished])

  const progress = useMemo(() => {
    if (!totalQuestionsLength) return 0
    return answerCount / totalQuestionsLength
  }, [answerCount, totalQuestionsLength])

  const motionProgress = useMotionValue(0)
  motionProgress.set(progress)

  const scaleY = useSpring(motionProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // scroll to bottom
  useEffect(() => {
    if (!scrollRef.current) return
    const target = scrollRef.current.lastChild as any
    if (!target) return
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    })
  }, [chatPageCount])

  useEffect(() => {
    if (!messages.length) return
    setChatPageCount(count => count + 1)
  }, [messages, setChatPageCount])

  async function chatPageQuestionsListFetcher(): Promise<QAPairConfig[][]> {
    const pagesQuery = await new LC.Query('SmartProfileInput')
      .equalTo('template', template)
      .ascending('pageIndex')
      .find()

    const pagesPromise = pagesQuery.map(async page => {
      const questionIds = page.get('questionIds') as string[]
      return await Promise.all(
        questionIds.map(
          async (questionId): Promise<QAPairConfig> =>
            await new LC.Query('SmartProfileQuestion')
              .equalTo('shortId', questionId)
              .first()
              .then(res => res?.toJSON()),
        ),
      )
    })

    return await Promise.all(pagesPromise)
  }

  function handleMouseMove({
    clientX,
    clientY,
  }: React.MouseEvent<HTMLElement>) {
    x.set(clientX)
    y.set(clientY)
    setPureXY({ x: clientX, y: clientY })
  }

  if (!isDesktop && !isTablet) {
    return (
      <main className="w-full h-full grid place-content-center">
        <p className="text-2xl tracking-widest text-center flex flex-col justify-center items-center gap-5">
          <ComputerDesktopIcon className="h-10" />
          <span>请使用屏幕更大的设备访问</span>
        </p>
      </main>
    )
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      className="w-full h-full pt-safe bg-gradient-to-b from-white via-indigo-50 to-indigo-100"
    >
      <section className="hidden">
        <audio loop ref={audioRef}>
          <source src="/music/countdown-bgm.aac" type="audio/mp3" />
        </audio>
      </section>

      {!showCountDown ? (
        <section className="absolute right-10 inset-y-48 z-50 w-2 bg-gray-400/10 rounded-full opacity-60">
          <motion.div
            className="h-full w-full bg-orchid-gradient"
            style={{ scaleY }}
          />
        </section>
      ) : null}

      <motion.div className={showEggplant ? '' : 'hidden'}>
        <Eggplant
          progress={showCountDown ? -1 : progress}
          className="absolute top-56 -left-20 w-56 aspect-square"
        />
      </motion.div>

      <motion.div
        animate={{
          opacity: 0.15,
          scale:
            Math.max(
              Math.abs(pureXY.x - innerWidth / 2),
              Math.abs(pureXY.y - innerHeight / 2),
            ) / 50,
        }}
        style={{ x, y }}
        className="absolute -top-10 -left-10 w-20 aspect-square blur-xl rounded-full pointer-events-none bg-orchid"
      />

      {showCountDown ? (
        <Countdown
          onClick={() => {
            audioRef.current && audioRef.current.play()
          }}
        />
      ) : chatPageQuestionsList ? (
        <>
          <section
            ref={scrollRef}
            className={clsx(
              "absolute w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide scroll-smooth",
              innerHeight > min_height ? 'snap-y snap-mandatory' : ''
            )}
          >
            {chatPageQuestionsList.slice(0, chatPageCount).map((q, i) => (
              <ChatPage
                key={q[0].shortId}
                pageNumber={i + 1}
                smartQuestions={q}
                messages={messages}
                setMessages={setMessages}
                setSkipToFinish={setSkipToFinish}
                setAnswerCount={setAnswerCount}
                className="snap-start h-screen w-full"
              />
            ))}
            {innerHeight > min_height ? (
              <section>
                <p className="p-3 text-gray-600/70">
                  Made by <span className="font-neox">X ACADEMY</span>{' '}
                  Developers, with ❤️
                </p>
              </section>
            ) : null}
          </section>

          <NextImage
            className="absolute z-0 bottom-10 left-1/2 transform -translate-x-1/2 w-10 h-10"
            src="/logo.svg"
            alt="logo"
          />
        </>
      ) : (
        <div className="fixed inset-0 z-0 flex flex-col justify-center items-center gap-10 text-indigo-400">
          <BoxLoading />
        </div>
      )}
    </main>
  )
}

function ChatPage({
  pageNumber,
  smartQuestions,
  // lastTwoMessages,
  messages,
  setMessages,
  setAnswerCount,
  setSkipToFinish,
  className,
}: {
  pageNumber: number
  // lastTwoMessages: Message[]
  messages: Message[]
  smartQuestions: QAPairConfig[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setAnswerCount: React.Dispatch<React.SetStateAction<number>>
  setSkipToFinish: React.Dispatch<React.SetStateAction<boolean>>
  className: string
}) {
  const inViewRef = useRef(null)
  const isInView = useInView(inViewRef)

  const [currentMessages, setCurrentMessages] = useState<Message[]>([
    { role: 'assistant', content: '' },
  ])

  const [numberAnimation, questionAnimation] = useMemo(
    () => [
      {
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
        scale: isInView ? 1.5 : 1,
        opacity: isInView ? 1 : 0,
      },
      {
        translateY: isInView ? 0 : 300,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
        opacity: isInView ? 1 : 0,
      },
    ],
    [isInView],
  )

  // Append messages on this page to all messages list once all questions on this page in completed
  useEffect(() => {
    if (currentMessages.length !== smartQuestions.length * 2) return
    setMessages(prevMsgs => [...prevMsgs, ...currentMessages])
  }, [currentMessages])
  return (
    <main className={clsx('flex flex-col p-6 sm:py-20', className)}>
      <motion.section
        className="fixed top-14 left-14 lg:left-[13%] lg:top-[100px] 2xl:left-[26%] 2xl:top-[108px] "
        style={numberAnimation}
      >
        <p className="font-outline text-gray-600/10 text-4xl scale-[2] sm:scale-[2.5]">{`${
          pageNumber < 10 ? '0' + pageNumber : pageNumber
        }`}</p>
      </motion.section>

      <motion.section
        className="w-full mt-16 flex flex-col gap-8 text-gray-600/70 text-xl lg:px-[7%] 2xl:px-[22%]"
        style={innerHeight > min_height ? questionAnimation : {}}
      >
        {currentMessages
          .filter(item => item.role === 'assistant')
          .map((_, index) => (
            <div
              key={smartQuestions[index].hint}
              className="w-full flex flex-col items-end gap-5"
            >
              <QAPair
                {...{
                  requestBody: {
                    currentQuestion: smartQuestions[index],
                    history: !smartQuestions[index].historyLength
                      ? []
                      : index > 0
                      ? currentMessages.slice(
                          -1 * (smartQuestions[index].historyLength + 1),
                          -1,
                        )
                      : messages.slice(
                          -1 * smartQuestions[index].historyLength,
                        ),
                  },
                  setCurrentMessages,
                  setAnswerCount,
                  isBreakpoint: smartQuestions[index].shortId === 'breakpoint',
                  setSkipToFinish,
                  lengths: {
                    currentMessagesLength: currentMessages.length,
                    totalChatLength: smartQuestions.length * 2,
                  },
                }}
              />
            </div>
          ))}
      </motion.section>
      <div ref={inViewRef} />
    </main>
  )
}
