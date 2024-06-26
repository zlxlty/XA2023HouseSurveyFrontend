import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  QAPairConfig,
  TextQAPair,
  SingleSelectionQAPair,
  MultiSelectionQAPair,
  DateQAPair,
  QuestionRequestBody,
  Message,
  QuestionBotAPIRequestBody,
} from '../types'
import clsx from 'clsx'
import { Input, Textarea } from '@nextui-org/react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { toast } from 'react-hot-toast'
import useSWRImmutable from 'swr/immutable'
import { validEmail } from '#/utils'
import { XCircleIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

type HandleSubmit = (value: string) => Promise<void>

export default function QAPair({
  requestBody,
  setCurrentMessages,
  setAnswerCount,
  setSkipToFinish,
  isBreakpoint,
  lengths,
}: {
  requestBody: QuestionRequestBody
  setCurrentMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setAnswerCount: React.Dispatch<React.SetStateAction<number>>
  setSkipToFinish: React.Dispatch<React.SetStateAction<boolean>>
  isBreakpoint: boolean
  lengths: {
    totalChatLength: number
    currentMessagesLength: number
  }
}) {
  const { hint } = requestBody.currentQuestion
  const defaultQuestion = requestBody.currentQuestion.defaultQuestion && requestBody.currentQuestion.defaultQuestion.trim()

  const [done, setDone] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [question, setQuestion] = useState<string>('')

  useSWRImmutable(
    !defaultQuestion ? 'smart-input-' + hint : null,
    async () => {
      await questionStreamFetcher(
        '/bot/question',
        {
          promptId: requestBody.currentQuestion.promptId,
          history: requestBody.history,
          currentQuestionHint: hint,
        },
        message => {
          setQuestion(q => q + message.token)
        },
        () => setDone(true),
      )
    },
    {
      suspense: false,
    },
  )

  // False streaming animation. Only execute when default value is presented
  useEffect(() => {
    if (!defaultQuestion || done) return

    setTimeout(() => {
      if (question.length < defaultQuestion.length) {
        setQuestion(pre => pre + defaultQuestion[pre.length])
      } else {
        setDone(true)
      }
    }, 10) //TODO: Change to 25
  }, [question])

  // Add completed question to the message history
  useEffect(() => {
    if (!done) return
    setCurrentMessages(list => {
      const oldList = list.slice(0, -1)
      return [...oldList, { role: 'assistant', content: question }]
    })
  }, [done])

  async function handleSubmit(lastAnswer: string) {
    const skipToFinish = isBreakpoint && lastAnswer === 'no'

    const isTheLast =
      lengths.currentMessagesLength + 1 === lengths.totalChatLength ||
      skipToFinish
    setCurrentMessages(prevMsgs => {
      const updatedMessages: Message[] = [
        ...prevMsgs,
        { role: 'user', content: `${lastAnswer}` }, //NOTE: 我的 是 May not be necessary
      ]
      if (!isTheLast) updatedMessages.push({ role: 'assistant', content: '' })
      return updatedMessages
    })

    setConfirmed(true)

    if (skipToFinish) {
      setSkipToFinish(true)
      return
    }
    setAnswerCount(count => (count += 1))
  }

  return (
    <>
      <main className="flex items-start self-start">
        <motion.div
          className="text-blue-400"
          style={{
            opacity: done && confirmed ? 0 : 1,
            transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 1s',
          }}
        >
          <svg
            className="w-8 h-8 -ml-2"
            fill="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="20" />
            <circle
              cx="50"
              cy="50"
              r="20"
              className="animate-ping origin-center"
            />
          </svg>
        </motion.div>
        <p className="leading-relaxed whitespace-pre-line text-base">
          {question}
        </p>
      </main>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-end items-center pl-10 -mt-2"
          >
            <AnswerComponent
              answerInput={requestBody.currentQuestion}
              handleSubmit={handleSubmit}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  )
}

function AnswerComponent({
  answerInput,
  handleSubmit,
}: {
  answerInput: QAPairConfig
  handleSubmit: HandleSubmit
}) {
  switch (answerInput.inputType) {
    case 'single-line-input':
      return <TextInput {...answerInput} handleSubmit={handleSubmit} />
    case 'multi-line-input':
      return <TextInput {...answerInput} handleSubmit={handleSubmit} multi />
    case 'date-input':
      return <DateInput {...answerInput} handleSubmit={handleSubmit} />
    case 'single-select':
      return <SingleSelect {...answerInput} handleSubmit={handleSubmit} />
    case 'multi-select':
      return <MultiSelect {...answerInput} handleSubmit={handleSubmit} />
  }
}

function TextInput({
  placeholder,
  handleSubmit,
  multi,
}: TextQAPair & {
  handleSubmit: HandleSubmit
  multi?: boolean
}) {
  const inputRef = useRef<HTMLDivElement>(null)
  const isEmail = placeholder && placeholder.includes('邮箱')

  const [isValided, setIsValided] = useState(true)

  function handleConfirm(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter') return
    const target = e.currentTarget
    if (!target.value) return

    if (isEmail && !validEmail(target.value)) {
      setIsValided(false)
      return
    } else {
      setIsValided(true)
    }

    target.blur()
    target.readOnly = true
    handleSubmit(target.value.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
  }

  return (
    <div
      ref={inputRef}
      className={clsx(
        'relative shadow-neumorphism overflow-hidden rounded-2xl',
        multi ? 'w-full' : null,
      )}
    >
      <Textarea
        className={(isValided ? 'contrast-150' : '') + ' overflow-hidden'}
        placeholder={placeholder}
        width={multi ? '100%' : '20vw'}
        minRows={multi ? 4 : 1}
        size="lg"
        status={isValided ? 'default' : 'error'}
        onKeyUp={handleConfirm}
        onKeyDown={handleKeyDown}
        {...{ enterKeyHint: 'send' }}
      />
      {!isValided ? (
        <XCircleIcon className="absolute w-7 right-2 top-1/2 -translate-y-1/2 text-red-500" />
      ) : null}
    </div>
  )
}

function DateInput({
  handleSubmit,
}: DateQAPair & { handleSubmit: HandleSubmit }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [visible, setVisible] = useState(false)

  function handleChange() {
    if (visible) return
    setVisible(true)
  }

  async function handleConfirm() {
    if (!inputRef.current) return
    if (!inputRef.current.value) return
    inputRef.current.blur()
    inputRef.current.readOnly = true
    setVisible(false)
    await handleSubmit(inputRef.current.value.trim())
  }

  return (
    <div className="w-full flex flex-col justify-center items-end gap-2.5">
      <div className="shadow-neumorphism overflow-hidden rounded-2xl">
        <Input
          className="contrast-150"
          ref={inputRef}
          onChange={handleChange}
          width="40vw"
          type="date"
          size="lg"
          min="1950-01-01"
          max="2020-01-01"
        />
      </div>
      <ConfirmButton visible={visible} handleConfirm={handleConfirm} />
    </div>
  )
}

function SingleSelect({
  options,
  handleSubmit,
}: SingleSelectionQAPair & { handleSubmit: HandleSubmit }) {
  const [selected, setSelected] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const visible = useMemo(
    () => !!selected && !isConfirmed,
    [selected, isConfirmed],
  )

  function handleSelect(e) {
    if (isConfirmed) return
    if (!e || e.target.nodeName !== 'LI') return
    const value = e.target.getAttribute('value') as string
    setSelected(value)
  }

  async function handleConfirm() {
    setIsConfirmed(true)
    await handleSubmit(selected)
  }

  return (
    <div className="w-full flex flex-col justify-center items-end gap-2">
      <ul
        onPointerDown={handleSelect}
        className="w-full max-w-fit min-h-fit gap-1 mx-0"
      >
        {options.map(({ display, value }, _) => {
          return (
            <motion.li
              key={value}
              whileTap={{ scale: 0.9 }}
              // whileHover={{ color: '#fff', backgroundColor: '#7A90FE'}}
              transition={{ duration: 0.1 }}
              value={value}
              className={clsx(
                selected === value
                  ? 'bg-indigo-400 text-gray-100'
                  : 'bg-white text-gray-500',
                'whitespace-pre-wrap text-sm min-w-[20vw]',
                'rounded-2xl grid place-content-center px-5 py-2 shadow-neumorphism duration-300',
                'hover:ring-2 hover:ring-[#7A90FE] cursor-pointer',
              )}
            >
              {display}
            </motion.li>
          )
        })}
      </ul>
      <ConfirmButton visible={visible} handleConfirm={handleConfirm} />
    </div>
  )
}

function MultiSelect({
  options,
  handleSubmit,
}: MultiSelectionQAPair & { handleSubmit: HandleSubmit }) {
  const [selectedList, setSelectedList] = useState<string[]>([])
  const [isConfirmed, setIsConfirmed] = useState(false)

  const selected = useMemo(() => selectedList.length > 0, [selectedList])

  function handleSelect(e) {
    if (isConfirmed) return
    if (!e || e.target.nodeName !== 'LI') return
    const value = e.target.getAttribute('value') as string
    setSelectedList(preValue => {
      if (preValue.includes(value)) {
        return preValue.filter(item => item !== value)
      } else {
        return [...preValue, value]
      }
    })
  }

  async function handleConfirm() {
    setIsConfirmed(true)
    await handleSubmit(selectedList.join(','))
  }

  return (
    <div className="w-full flex flex-col justify-center items-end gap-4">
      <ul
        onPointerUp={handleSelect}
        className="w-[85%] rounded-3xl py-4 flex-row-reverse flex gap-2 flex-wrap"
      >
        {options
          .sort((a, b) => a.length - b.length)
          .map(option => (
            <motion.li
              key={option}
              whileTap={{ scale: 0.9 }}
              value={option}
              className={clsx(
                selectedList.includes(option)
                  ? 'bg-indigo-400 text-gray-100'
                  : 'bg-white text-gray-500',
                'rounded-2xl grid place-content-center whitespace-nowrap px-4 py-2.5 text-base shadow-neumorphism duration-300',
                'hover:ring-2 hover:ring-[#7A90FE] cursor-pointer',
              )}
            >
              {option}
            </motion.li>
          ))}
      </ul>
      <ConfirmButton skippable selected={selected} visible={!isConfirmed} handleConfirm={handleConfirm} />
    </div>
  )
}

function ConfirmButton({
  skippable = false,
  selected,
  visible,
  handleConfirm,
}: {
  skippable?: boolean
  selected?: boolean
  visible: boolean
  handleConfirm: () => void
}) {
  if (!visible) return null
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onTap={handleConfirm}
      className="rounded-full bg-orchid-gradient p-3 shadow-neumorphism duration-300"
    >
      <p className="text-sm text-gray-50">
        {skippable && !selected ? (
          <ArrowDownIcon className="w-5 h-5"/>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </p>
    </motion.button>
  )
}

export const questionStreamFetcher = async (
  route: string,
  body: QuestionBotAPIRequestBody,
  onmessage: (data: any) => void,
  onclose: () => void,
) => {
  return await fetchEventSource(`${import.meta.env.VITE_PUBLIC_HOST}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    openWhenHidden: true,
    onmessage: ev => {
      console.info('QuestionStream: SSE message received', ev)

      if (!ev.data) return // ping message

      let data = JSON.parse(ev.data)

      console.info('QuestionStream: parsed event source message', data)

      onmessage(data)
    },
    // onclose() {
    //   // if the server closes the connection unexpectedly, DO NOT retry
    //   throw new Error('QuestionStream: SSE connection closed unexpectedly')
    // },
    onclose,
    onerror: ev => {
      toast.error('获取回答时出现了一个问题：' + ev)
      throw new Error('QuestionStream: SSE error: ' + ev)
    },
    async onopen(response) {
      if (response.ok) {
        return // everything's good
      }

      // if the server responds with an error, DO NOT retry
      throw new Error(
        'QuestionStream: SSE connection failed: ' +
          response.status +
          ' ' +
          response.statusText,
      )
    },
  })
}
