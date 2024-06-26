import Image from '#/components/next-image'
import { fetchUserIdentity } from '#/utils/server'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import friendIcon from '#/assets/icons/profile-friend.svg'
import useSWR from 'swr'
import { RoundedButton } from 'ui'
import LC from 'leancloud-storage';

export default function RequestFriendButton({
  className,
  userId,
}: {
  className?: string
  userId: string
}) {
  const User = LC.User.current()
  const navigate = useNavigate()

  if (userId === 'self' || (User && userId === User.id)) return null

  const Friend = LC.Object.createWithoutData('_User', userId)

  const {
    data: relationship,
    isLoading,
    mutate,
  } = useSWR(User ? `relationship-${userId}` : null, async () => {
    if (!User) {
      console.error('no User')
      throw new Error('no User')
    }

    const isFriend = await new LC.Query('_Followee')
      .equalTo('user', User)
      .equalTo('followee', Friend)
      .equalTo('friendStatus', true)
      .first()

    if (isFriend) return 'isFriend'

    const isSent = !!(await new LC.Query('_FriendshipRequest')
      .equalTo('user', User)
      .equalTo('status', 'pending')
      .equalTo('friend', Friend)
      .first())

    if (isSent) return 'isSent'

    const isPublic = (await fetchUserIdentity(userId)).isPublic

    if (isPublic) return 'isPublic'

    return undefined
  })

  async function handleSendFriendRequest() {
    if (relationship) return

    try {
      if (User) {
        await LC.Friendship.request(userId)
        mutate('isSent')
      } else {
        localStorage.setItem('inviterId', userId)
        navigate('/login', { replace: true })
      }
    } catch (error) {
      console.log(error)
      alert('加好友失败')
    }
  }

  if (isLoading) return null
  if (relationship === 'isFriend' || relationship === 'isPublic') return null

  return (
    <RoundedButton
      onClick={handleSendFriendRequest}
      color="gradient"
      className={clsx(
        { 'animate-bounce': !relationship },
        'py-3 px-5',
        className,
      )}
    >
      <div className="w-full flex justify-center items-center gap-2">
        <Image src={friendIcon} alt="friend" />
        <p className="text-sm align-middle">
          {!relationship ? '添加 Ta 为我的超级好友！' : '已发送好友申请！'}
        </p>
      </div>
    </RoundedButton>
  )
}
