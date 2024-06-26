import React, { useEffect, useState } from 'react'
import { useStore } from '#/stores'
import { parsePathname } from '#/utils'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { Event } from 'leancloud-realtime'
import toast, { Toaster } from 'react-hot-toast'
import { fetchUserIdentity } from '#/utils/server'
import { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'
import { useLocation, useNavigate } from 'react-router-dom'
import PageLoading from '#/components/page-loading'
import LC from 'leancloud-storage'
import useSWRImmutable from 'swr/immutable'

export default function GlobalMain({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { mutate } = useSWRConfig()

  const isXA = pathname.includes('xa')
  if (isXA) localStorage.setItem('isXA', '1')

  const [segment, ...params] = parsePathname(pathname)
  if (segment !== 'moment') Cookies.remove('pageNumber')

  const [
    initializeRealtimeClient,
    realtimeClient,
    setIsAuthenticated,
    isAuthenticated,
    initializeMyProfile,
    getEditableACL,
  ] = useStore(state => [
    state.initializeRealtimeClient,
    state.realtimeClient,
    state.setIsAuthenticated,
    state.isAuthenticated,
    state.initializeMyProfile,
    state.getEditableACL,
  ])

  const currentUser = LC.User.current()

  const [isInitialized, setIsInitialized] = useState(false)

  useSWRImmutable<boolean>(currentUser ? 'isXAer' : null, async () => {
    const userData = await new LC.Query('_User').get(currentUser.id!)
    return userData.get('XAProfileCompleted')
  })

  useEffect(() => {
    getIsAuthenticated().then(bool => {
      setIsAuthenticated(bool)
      setIsInitialized(true)
    })

    async function getIsAuthenticated() {
      return currentUser ? await currentUser.isAuthenticated() : false
    }
  }, [LC])

  useEffect(() => {
    if (!isInitialized) return

    setup().then(async routerTo => {
      if (isAuthenticated) {
        const session = currentUser.getSessionToken()
        Cookies.set('session', session)
        session && (await initializeRealtimeClient())
      }
      if (routerTo) {
        const redirectTo = localStorage.getItem('redirectTo')
        if (redirectTo) {
          localStorage.removeItem('redirectTo')
          navigate(redirectTo, { replace: true })
        } else {
          navigate(routerTo, { replace: true })
        }
      }
    })

    async function setup(): Promise<
      | '/discover'
      | '/onboarding'
      | '/profile-settings/smart-input?template=mirro-initialize'
      | '/login'
      | '/xa'
      | null
    > {
      const profileCompleted: boolean = isAuthenticated
        ? (await new LC.Query('_User').get(currentUser.id!!)).get(
          'profileCompleted',
        )
        : false

      switch (true) {
        case !!isXA:
          if (!isAuthenticated) {
            localStorage.setItem(
              'redirectTo',
              '/xa',
            )
            navigate('/login?type=xa', { replace: true })
            return null
          } else {
            return '/xa'
          }

        case !isAuthenticated && segment !== 'login' && segment !== 'profile':
          return '/onboarding'

        case isAuthenticated && segment !== 'login':
          await initializeMyProfile()
          if (segment !== '') break
          return profileCompleted
            ? '/discover'
            : '/profile-settings/smart-input?template=mirro-initialize'

        case isAuthenticated && segment === 'login':
          const hasProfile = await initializeMyProfile()
          if (hasProfile)
            return profileCompleted
              ? '/discover'
              : '/profile-settings/smart-input?template=mirro-initialize'
          else {
            const editableACL = getEditableACL()
            try {
              const userProfileQuery = new LC.Object('UserProfile')
                .setACL(editableACL)
                .set('User', currentUser)
              localStorage.getItem('isXA') && userProfileQuery.set('lookingFor', 'XA')
              await userProfileQuery.save()
              await initializeMyProfile()
              console.log(`create profile successful.`)

              localStorage.setItem('needMemeTutorial', 'true')
              return '/profile-settings/smart-input?template=mirro-initialize'
            } catch (error) {
              const err = error as Error
              console.log('fail to create a profile row\n', err)
            }
          }
          break
      }
      return null
    }
  }, [isInitialized, isAuthenticated])

  useEffect(() => {
    if (window.__wxjs_environment !== 'miniprogram' || !currentUser) return

    handleWxSDK()

    async function handleWxSDK() {
      const { default: wx } = await import('weixin-js-sdk-ts')
      wx.miniProgram.postMessage({ data: { userId: currentUser.id } })
    }
  }, [currentUser])

  useEffect(() => {
    if (!realtimeClient) return
    realtimeClient.on(Event.MESSAGE, async message => {
      if (!message) return
      if (message.from.endsWith('-handler')) return
      if (message.from.includes(currentUser.id!)) return

      await mutate(unstable_serialize(index => `chatList-${index}`))
      if (
        segment === 'chat' &&
        (params[0] !== 'private' || params[1] === message.from)
      )
        return

      const { username } = await fetchUserIdentity(message.from)
      const toastText = `${username} 发了一条消息`
      toast.success(toastText, {
        duration: 5000,
        icon: '💬',
      })
    })

    return () => {
      realtimeClient.off(Event.MESSAGE)
    }
  }, [realtimeClient, pathname])

  return (
    <main
      className={clsx(
        'bg-gradient-to-b from-white via-indigo-50 to-indigo-100 select-none',
        className,
      )}
    >
      {isInitialized ? (
        <div className="shadow-neumorphism-inner w-full h-full overflow-y-auto scrollbar-hide select-none">
          {children}
        </div>
      ) : (
        <PageLoading />
      )}
      <Toaster containerClassName="mt-safe" />
    </main>
  )
}

