import { Button, Modal } from '@nextui-org/react'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import clsx from 'clsx'
import LC from 'leancloud-storage';

export const BlockDialogButton: FC<{
  blockAgainstUserId: string
}> = ({ blockAgainstUserId }) => {
  const [open, setOpen] = useState(false)
  const {
    data: blockedStatus,
    isValidating,
    mutate,
  } = useSWR('_blockedStatus::' + blockAgainstUserId, async () => {
    const currentUser = LC.User.current()
    if (!currentUser) return false

    const query = new LC.Query('BlockedRelationship')
    query.equalTo('createdUser', currentUser)
    query.equalTo(
      'blockedUser',
      LC.Object.createWithoutData('_User', blockAgainstUserId),
    )

    return !!(await query.first())
  }, { suspense: false })

  const handleToggleBlock = async () => {
    const currentUser = LC.User.current()
    if (!currentUser) return

    if (blockedStatus) {
      const query = new LC.Query('BlockedRelationship')
      query.equalTo('createdUser', currentUser)
      query.equalTo(
        'blockedUser',
        LC.Object.createWithoutData('_User', blockAgainstUserId),
      )

      const blockedRelationship = await query.find()
      await LC.Object.destroyAll(blockedRelationship as any)
      toast.success('操作成功')
      mutate(false)
      setOpen(false)
      return
    } else {
      const BlockedRelationship = LC.Object.extend('BlockedRelationship')
      const blockedRelationship = new BlockedRelationship()
      blockedRelationship.set('createdUser', currentUser)
      blockedRelationship.set(
        'blockedUser',
        LC.Object.createWithoutData('_User', blockAgainstUserId),
      )

      await blockedRelationship.save()
      toast.success('操作成功')
      mutate(true)
      setOpen(false)
      return
    }
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <p className="text-lg text-gray-500">
            {blockedStatus ? '移除黑名单' : '加入黑名单'}
          </p>
        </Modal.Header>

        <Modal.Footer>
          <Button auto onPress={() => setOpen(false)} light>
            取消
          </Button>

          <div className="flex-1" />

          <Button auto onPress={handleToggleBlock} color="error">
            {blockedStatus ? '从黑名单中移除' : '加入黑名单'}
          </Button>
        </Modal.Footer>
      </Modal>

      <button
        className={clsx(
          'flex justify-center items-center gap-2 rounded-2xl py-2 px-8 shadow-neumorphism bg-transparent border border-red-500 border-solid text-sm',
          isValidating && 'bg-gray-200',
        )}
        onClick={() => setOpen(true)}
      >
        <span>{blockedStatus ? '移除黑名单' : '加入黑名单'}</span>
      </button>
    </>
  )
}
