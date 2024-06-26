import Image from '#/components/next-image'
import { Modal } from '@nextui-org/react'
import { marked } from 'marked'
import { useMemo, useState } from 'react'
import agreementContent from './agreement.md?raw'

export default function Agreement() {
  const [isShowing, setIsShowing] = useState(false)
  const renderedUserAgreementContentHTML = useMemo(() => {
    return marked(agreementContent, {
      headerIds: false,
      mangle: false,
    })
  }, [])

  return (
    <>
      <Image
        className="object-cover inline-block"
        src="/icons/info.png"
        alt="info icon"
        width={16}
        height={16}
        style={{ height: 'auto', width: 'auto' }}
      />
      <span className="text-xs text-gray-800/40">
        用户登陆即视为接受
        <button onClick={() => setIsShowing(true)}>
          <span className="underline decoration-slate-400">
            《用户使用协议》
          </span>
        </button>
      </span>
      <Modal
        css={{ margin: '10px 1.5rem' }}
        closeButton
        open={isShowing}
        onClose={() => setIsShowing(false)}
      >
        <article
          className="prose p-6 text-left prose-headings:text-center text-sm prose-li:font-semibold leading-6"
          dangerouslySetInnerHTML={{
            __html: renderedUserAgreementContentHTML,
          }}
        />
      </Modal>
    </>
  )
}
