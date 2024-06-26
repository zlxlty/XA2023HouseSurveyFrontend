import Image from '#/components/next-image'
import { Button, Modal } from '@nextui-org/react'

import arrowIcon from '#/assets/icons/arrow.svg'
import step1Image from '#/assets/share/share-step-1.png'
import step2Image from '#/assets/share/share-step-2.png'
import { useEffect } from 'react'
import { envBuildIsApp } from '#/utils/environment'
import { MirroPlugin } from '#/utils/capacitor/plugin/wrap'
import BoxLoading from '#/components/box-loading'

export default function ShareTutorialModal({
  visible,
  closeHandler,
}: {
  visible: boolean
  closeHandler: () => void
}) {
  useEffect(() => {
    if (visible && envBuildIsApp) {
      MirroPlugin.shareToWechat({
        title: '向你介绍，我的超智能虚拟化身',
        description: '向你介绍，我的超智能虚拟化身',
      })
    }
  }, [visible])

  return (
    <Modal
      fullScreen
      noPadding
      aria-labelledby="modal-title"
      open={visible}
      onClick={closeHandler}
      css={{
        borderRadius: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(10px)',
        paddingBottom: '2.25rem',
      }}
    >
      {!envBuildIsApp ? (
        <>
          <Modal.Header>
            <Image
              className="fixed top-0 right-[4.2rem]"
              src={arrowIcon}
              alt="arrow"
            ></Image>
          </Modal.Header>
          <Modal.Body className="flex justify-center items-center text-gray-50">
            <p>第一步: 点击右上方三点进入</p>
            <Image
              className="w-[40%] pb-7"
              src={step1Image}
              alt="step 1 image"
            ></Image>
            <p>第二步: 点击“转发给朋友”</p>
            <Image
              className="w-[80%]"
              src={step2Image}
              alt="step 2 image"
            ></Image>
          </Modal.Body>
        </>
      ) : (
        <Modal.Body className="flex justify-center items-center text-gray-50 gap-4">
          <BoxLoading />
          <p>分享中...</p>
          <Button onClick={closeHandler}>完成</Button>
        </Modal.Body>
      )}
    </Modal>
  )
}
