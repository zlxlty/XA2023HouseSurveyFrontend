import { Button, Input, Modal } from '@nextui-org/react'
import { FC, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import LC from 'leancloud-storage';

export const ReportDialogButton: FC<{
  reportAgainstUserId: string
}> = ({ reportAgainstUserId }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = reason
    }
  }, [reason])

  const handleReport = async () => {
    const currentUser = LC.User.current()
    if (!currentUser) return

    const UserReport = LC.Object.extend('UserReport')
    const userReport = new UserReport()
    userReport.set('reason', reason)
    userReport.set('reportUser', currentUser)
    userReport.set(
      'reportAgainstUser',
      LC.Object.createWithoutData('_User', reportAgainstUserId),
    )

    await userReport.save()

    toast.success('举报成功')
    setOpen(false)
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <p className="text-lg text-gray-500">举报</p>
        </Modal.Header>

        <Modal.Body>
          <Input
            ref={inputRef}
            placeholder="举报原因"
            onChange={e => setReason(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button auto onPress={() => setOpen(false)} light>
            取消
          </Button>

          <div className="flex-1" />

          <Button auto onPress={handleReport} color="error">
            提交
          </Button>
        </Modal.Footer>
      </Modal>

      <button
        className="flex justify-center items-center gap-2 rounded-3xl py-2 px-8 shadow-neumorphism bg-transparent border border-red-500 border-solid text-sm"
        onClick={() => setOpen(true)}
      >
        举报
      </button>
    </>
  )
}
