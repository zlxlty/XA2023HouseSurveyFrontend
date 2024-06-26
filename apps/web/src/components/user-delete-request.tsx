import { useStore } from '#/stores'
import { Button, Input, Modal } from '@nextui-org/react'
import { FC, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import LC from 'leancloud-storage';

export const UserDeleteRequestDialogButton: FC = () => {
  const [logout] = useStore(state => [
    state.logout,
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [countdown, setCountdown] = useState(0)
  const countdownInterval = useRef<number>()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = comment
    }
  }, [comment])

  const handleDelete = async () => {
    const currentUser = LC.User.current()
    if (!currentUser) return

    const DeletionRequest = LC.Object.extend('DeletionRequest')
    const deletionRequest = new DeletionRequest()
    deletionRequest.set('user', currentUser)
    deletionRequest.set('comment', comment)
    await deletionRequest.save()

    toast.success('删除请求已提交')
    
    logout()
  }

  useEffect(() => {
    if (open) {
      setCountdown(10)
      countdownInterval.current = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(countdownInterval.current)
            return 0
          }
          return prev - 1
        })
      }, 1000) as unknown as number
    }

    return () => {
      clearInterval(countdownInterval.current)
    }
  }, [open])

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header className="flex flex-col mt-2">
          <p className="text-lg text-gray-500 mb-0">用户数据删除请求</p>
          <p className="text-sm text-red-400">请谨慎操作，一旦删除将无法恢复</p>
        </Modal.Header>

        <Modal.Body>
          <Input
            ref={inputRef}
            placeholder="为 Mirro 留下你的建议"
            onChange={e => setComment(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button auto onPress={() => setOpen(false)} light>
            取消
          </Button>

          <div className="flex-1" />

          <Button
            auto
            onPress={handleDelete}
            color="error"
            disabled={countdown > 0}
          >
            提交删除请求
            {countdown > 0 && ` (${countdown})`}
          </Button>
        </Modal.Footer>
      </Modal>

      {expanded ? (
        <div className="flex items-center gap-4">
          <button
            className="flex justify-center items-center gap-2 rounded-3xl py-2 px-8 shadow-neumorphism bg-transparent border border-red-500 border-solid text-sm"
            onClick={() => setOpen(true)}
          >
            销毁账户信息...
          </button>

          <button
            className="flex justify-center items-center gap-2 rounded-3xl py-2 px-8 shadow-neumorphism bg-transparent border border-red-500 border-solid text-sm"
            onClick={() => logout()}
          >
            登出
          </button>
        </div>
      ) : (
        <button
          className="flex justify-center items-center gap-2 rounded-3xl py-3 px-8 shadow-neumorphism bg-gradient-to-tr from-[#8F9BB3] to-[#f3f9ff] active:shadow-neumorphism-inner"
          onClick={() => setExpanded(true)}
        >
          <p className="text-gray-50 text-sm">其他操作</p>
        </button>
      )}
    </>
  )
}
