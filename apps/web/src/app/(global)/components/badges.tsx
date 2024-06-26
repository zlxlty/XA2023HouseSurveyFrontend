import { useStore } from '#/stores'
import type { ConvAttributes } from '#/types'
import { Event } from 'leancloud-realtime'
import React, { useEffect, useMemo, useState } from 'react'
import { Badge } from '@nextui-org/react'
import useSWR from 'swr'
import { MirroPlugin } from '#/utils/capacitor/plugin/wrap'
import LC from 'leancloud-storage';

interface UnreadInfo {
  [conversationId: string]: number
}

export function UnreadBadgeBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const realtimeClient = useStore(state => state.realtimeClient)
  const [unreadInfo, setUnreadInfo] = useState<UnreadInfo>({})
  const totalUnread = useMemo(() => {
    return Object.values(unreadInfo).reduce((prev, curr) => prev + curr, 0)
  }, [unreadInfo])

  useEffect(() => {
    if (!realtimeClient) return

    realtimeClient.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, conversations => {
      if (!conversations || !conversations.length) return

      setUnreadInfo(unreadInfo => {
        const newUnreadInfo = conversations.reduce(
          (prev, { unreadMessagesCount, _attributes, id }) => {
            const attributes = _attributes.attributes as ConvAttributes
            if (attributes.type === 'meme') return prev
            const unread = unreadMessagesCount.valueOf()
            return { ...prev, [id]: unread }
          },
          unreadInfo,
        )
        return newUnreadInfo
      })
    })
    return () => {
      realtimeClient.off(Event.UNREAD_MESSAGES_COUNT_UPDATE)
    }
  }, [realtimeClient, setUnreadInfo])

  useEffect(() => {
    MirroPlugin.notifyUnreadCount({
      count: totalUnread,
    })
  }, [totalUnread])

  return (
    <Badge
      isInvisible={!totalUnread}
      shape="circle"
      color="error"
      content={totalUnread}
      disableOutline
      size="xs"
      css={{ fontWeight: '$normal', fontSize: '$xs' }}
    >
      {children}
    </Badge>
  )
}

export function MatchBadgeBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const User = LC.User.current()

  const { data: _matchCount } = useSWR(
    User ? 'matchCount' : null,
    fetchMatchCount,
    { suspense: false },
  )
  const matchCount = typeof _matchCount === 'number' ? _matchCount : 0

  async function fetchMatchCount():Promise<number> {
    const matchQuery = await new LC.Query('Match').equalTo('User', User).first()
    if (!matchQuery) return 10
    const { count } = matchQuery.get('matchLog')
    return count
  }

  return (
    <Badge
      isInvisible={matchCount <= 0}
      shape="circle"
      color="error"
      content={matchCount}
      disableOutline
      size="xs"
      css={{ fontWeight: '$normal', fontSize: '$xs' }}
    >
      {children}
    </Badge>
  )
}
