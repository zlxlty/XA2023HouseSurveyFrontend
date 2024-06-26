import countryCodeJSON from '#/assets/country-code.json'
import BoxLoading from '#/components/box-loading'
import Image from '#/components/next-image'
import { useStore } from '#/stores'
import clsx from 'clsx'
import { useEffect, useState, useRef } from 'react'
import { InputBox } from 'ui'
import Agreement from './components/agreement'
import { useTitle } from '#/utils/useTitle'
import LC from 'leancloud-storage'
import { useSearchParams } from 'react-router-dom'
import { textAnimation } from '#/utils'

export default function Page() {
  useTitle('登录')

  const [status, setStatus] = useState<'loading' | 'landing' | 'login'>(
    'landing',
  )

  const XATitleRef = useRef<HTMLParagraphElement>(null)
  const XAIntervals = useRef<NodeJS.Timer[]>([])

  const [searchParams] = useSearchParams()
  const isXA = searchParams.get('type') === 'xa'

  useEffect(() => {
    if (!isXA || !XATitleRef.current) return
    handleTitleAnimation()

    setTimeout(() => {
      if (!XATitleRef.current) return
      XAIntervals.current.push(textAnimation(XATitleRef.current, 'WHY WAIT?', 0))
      XATitleRef.current!.style.transform = 'translateX(70px) scale(1.2)'
      setTimeout(() => {
        if (!XATitleRef.current) return
        XAIntervals.current.push(textAnimation(XATitleRef.current, 'X ACADEMY', 0))
        XATitleRef.current!.style.transform = 'translateX(45px) scale(1.2)'
      }, 3500)
    }, 60000)

    return () => {
      XAIntervals.current.map(i => clearInterval(i))
    }
  }, [])

  function handleTitleAnimation() {
    if (!XATitleRef.current) return
    textAnimation(XATitleRef.current, 'X ACADEMY', 2)
  }

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-around px-6 sm:justify-center sm:gap-48">
      <section className="w-2/3 space-y-2">
        {isXA ? (
          <div className="sm:w-[400px] flex flex-col gap-2 mx-auto">
            <div className='w-full text-center'>
              <p ref={XATitleRef} onMouseEnter={handleTitleAnimation} className={clsx(
                'text-3xl font-neox tracking-normal',
                'sm:text-5xl sm:scale-[1.2] sm:w-[350px] sm:text-left sm:translate-x-[38px]'
              )}>X ACADEMY</p>
            </div>
            <p className="text-center sm:text-right text-gray-800/50 sm:pr-1 sm:tracking-wide">
              时空探索者计划交互入口
            </p>
          </div>
        ) : (
          <>
            <Image
              src="/logo-large.svg"
              alt="Mirro"
              className="px-6 mx-auto sm:w-72"
              width={500}
              height={500}
              style={{ height: 'auto', width: 'auto' }}
            />
            <p className="text-center text-gray-800/50">
              高智能虚拟替身·连接真实的TA
            </p>
          </>
        )}
      </section>
      <section className="sm:h-64 flex items-end w-full sm:w-auto">
        {status === 'landing' && (
          <LandingPage handleLoginByNumber={() => setStatus('login')} />
        )}
        {status === 'login' && <LoginPage />}
      </section>
    </main>
  )
}

function LandingPage({
  handleLoginByNumber,
}: {
  handleLoginByNumber: () => void
}) {
  const [searchParams] = useSearchParams()
  const isXA = searchParams.get('type') === 'xa'

  return (
    <section className="flex flex-col justify-center items-center gap-6 w-full sm:w-80">
      <LoginButton
        text="手机号登录"
        onClick={handleLoginByNumber}
        className="w-full hover:bg-white/50"
      >
        <Image
          className="object-cover"
          src="/icons/phone.png"
          alt="phone icon"
          width={20}
          height={20}
        />
      </LoginButton>
      {/* <LoginButton text='coming soon...' onClick={() => 'wechat'} className='w-full pointer-events-none bg-gray-400/50'>
        <Image className="object-cover" src="/icons/wechat.png" alt="wechat icon" width={20} height={20} quality={100} priority={true} style={{ height: 'auto', width: 'auto' }} />
      </LoginButton> */}
      {!isXA ? (
        <div className="space-x-1 -mt-3 scale-90 mx-auto">
          <Agreement />
        </div>
      ) : null}
    </section>
  )
}

function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useStore(state => [
    state.isAuthenticated,
    state.setIsAuthenticated,
  ])

  const [countryCode, setCountryCode] = useState('+86')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [pending, setPending] = useState(false)
  // const [isShowingInvitationCodeModal, setIsShowingInvitationCodeModal] = useState(false);
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    setIsActive(!!phoneNumber && smsCode.length === 6)
  }, [phoneNumber, smsCode])

  async function handleRequestCode(): Promise<boolean> {
    if (!phoneNumber) return Promise.reject()
    try {
      const fullNumber = countryCode + phoneNumber

      // if (isWithoutCheck) {
      //   await LC.Cloud.requestSmsCode(fullNumber);
      //   return true;
      // }

      // const isNeedInvitationCode = await getIsNeedInvitationCode(fullNumber);

      // if (isNeedInvitationCode) {
      //   setIsShowingInvitationCodeModal(true);
      //   return false;
      // } else {
      await LC.Cloud.requestSmsCode(fullNumber)
      return true
      // }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async function handleSignUp() {
    setPending(true)
    try {
      const fullNumber = countryCode + phoneNumber
      await LC.User.signUpOrlogInWithMobilePhone(fullNumber, smsCode)
      setIsAuthenticated(true)
    } catch (e) {
      alert('验证码不正确')
      console.log(e)
    } finally {
      setPending(false)
    }
  }

  // async function getIsNeedInvitationCode(fullNumber: string) {
  //   const res = (await new LC.Query('InvitationCode')
  //     .equalTo('phone', fullNumber)
  //     .count()) as number;
  //   return res === 0;
  // }

  // async function checkInvitationCode(code: string) {
  //   const codeQuery = await new LC.Query('InvitationCode')
  //     .equalTo('code', code)
  //     .first()
  //   if (codeQuery) {
  //     const isUsed = !!codeQuery.get('phone');
  //     if (isUsed) {
  //       alert('邀请码用过啦');
  //     } else {
  //       codeQuery.set('phone', countryCode + phoneNumber);
  //       await codeQuery.save();
  //       alert('邀请码通过,已向您发送短信验证码');
  //       setIsShowingInvitationCodeModal(false);
  //       handleRequestCode(true);
  //       setCountdown(60);
  //     }
  //   } else {
  //     alert('邀请码不对撒');
  //   }
  // }

  return isAuthenticated ? null : (
    <>
      <section className="flex flex-col justify-center items-center gap-4 w-full sm:w-80">
        <div className="relative w-full h-10 text-sm">
          <CountryCodeList
            className="absolute top-1/2 -translate-y-1/2 left-2"
            countryCode={countryCode}
            setCountryCode={setCountryCode}
          />
          <InputBox
            placeholder="手机号"
            className="py-2 !pl-[7.5rem] h-full !text-gray-400"
            transferInputValue={setPhoneNumber}
          />
          <RequestCodeButton
            {...{ handleRequestCode, countdown, setCountdown }}
            className="absolute top-1/2 -translate-y-1/2 right-2"
          />
        </div>
        <div className="relative w-full h-10 text-sm">
          <InputBox
            placeholder="验证码"
            className="py-2 h-full !text-gray-400"
            transferInputValue={setSmsCode}
            maxLength={6}
          />
        </div>
        {pending ? (
          <div className="w-32 flex items-center self-end justify-center scale-75">
            <BoxLoading />
          </div>
        ) : (
          <LoginButton
            text="下一步"
            onClick={handleSignUp}
            className={clsx(
              isActive
                ? ' text-gray-50 bg-[#8EA1E4]'
                : 'text-gray-800/50 bg-white/60 pointer-events-none',
              'w-1/3 h-10 text-sm self-end duration-300',
            )}
          />
        )}
      </section>
      {/* <CheckInvitationModal {...{ isShowingInvitationCodeModal, setIsShowingInvitationCodeModal, checkInvitationCode }} /> */}
    </>
  )
}

function RequestCodeButton({
  handleRequestCode,
  countdown,
  setCountdown,
  className,
}: {
  handleRequestCode: () => Promise<boolean>
  countdown: number
  setCountdown: React.Dispatch<React.SetStateAction<number>>
  className?: string
}) {
  const [pending, setPending] = useState(false)
  useEffect(() => {
    let interval: NodeJS.Timer
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1)
        if (countdown === 0) clearInterval(interval)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  async function handleClick() {
    setPending(true)
    try {
      const res = await handleRequestCode()
      res && setCountdown(60)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={className}>
      {pending ? (
        <p className="p-2 text-gray-800/40 select-none text-xs">正在发送...</p>
      ) : countdown === 0 ? (
        <button
          onClick={handleClick}
          tabIndex={-1}
          className="p-2 text-gray-800/40 focus:text-gray-800/70"
        >
          发送验证码
        </button>
      ) : (
        <p className="p-2 text-gray-800/40 select-none">{countdown}s</p>
      )}{' '}
    </div>
  )
}

function CountryCodeList({
  countryCode,
  setCountryCode,
  className,
}: {
  countryCode: string
  setCountryCode: (countryCode: string) => void
  className?: string
}) {
  const list = countryCodeJSON
  return (
    <select
      className={clsx(
        'w-28 outline-none bg-white/0 text-gray-800/40 scale-90 overflow-hidden text-center',
        className,
      )}
      value={countryCode}
      onChange={e => setCountryCode(e.target.value)}
    >
      {list.map(({ name, code }) => (
        <option
          className="w-full outline-none"
          value={code}
          key={name}
        >{`${name} ${code}`}</option>
      ))}
    </select>
  )
}

// function CheckInvitationModal(
//   {
//     isShowingInvitationCodeModal,
//     setIsShowingInvitationCodeModal,
//     checkInvitationCode
//   }:
//     {
//       isShowingInvitationCodeModal: boolean;
//       setIsShowingInvitationCodeModal: (bool: boolean) => void;
//       checkInvitationCode: (code: string) => Promise<void>
//     }
// ) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   function handleSubmit() {
//     if (!inputRef.current) return;
//     const content = inputRef.current.value.trim();
//     if (!content) return;

//     checkInvitationCode(content);
//   }

//   return (
//     <Modal
//       width="80%"
//       aria-label="modal-check-code"
//       blur
//       closeButton
//       onClose={() => { setIsShowingInvitationCodeModal(false) }}
//       preventClose
//       open={isShowingInvitationCodeModal}
//     >
//       <Modal.Header>
//         <div className="text-base pt-4">
//           <p >当前<span className="font-bold"> Mirro AI </span>在内测阶段</p>
//           <p >请先输入你的专属邀请码</p>
//         </div>
//       </Modal.Header>

//       <Modal.Body>
//         <Input ref={inputRef} clearable fullWidth size="md" />
//       </Modal.Body>

//       <Modal.Footer>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.8 }}
//           className="bg-transparent rounded-xl border-[1.3px] text-xs text-gray-400 px-3 py-2 border-gray-400"
//           onTap={() => handleSubmit()}
//         >
//           <p>提交</p>
//         </motion.button>
//       </Modal.Footer>
//     </Modal>
//   )
// }

function LoginButton({
  text,
  onClick = () => { },
  className,
  children,
}: {
  text: string
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'backdrop-blur-[2px] text-sm flex gap-3 items-center justify-center shadow-neumorphism rounded-full p-2 active:shadow-neumorphism-inner',
        className,
      )}
    >
      {children}
      <p>{text}</p>
    </button>
  )
}
