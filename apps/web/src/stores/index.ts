import type { UserProfile } from '#/types'
import { initializeRealtime } from '#/utils/leancloud'
import {
  TextMessage,
  type ConversationBase,
  type IMClient,
} from 'leancloud-realtime'
import { create } from 'zustand'
import LC, { type ACL } from 'leancloud-storage';

type setValue<T> = (value: T) => void

interface LeanCloudStore {
  isAuthenticated: boolean
  setIsAuthenticated: setValue<LeanCloudStore['isAuthenticated']>
  logout: () => Promise<void>
  getEditableACL: () => ACL
  getReadonlyACL: () => ACL
}

interface RealtimeStore {
  realtimeClient: IMClient
  initializeRealtimeClient: () => Promise<RealtimeStore['realtimeClient']>
  sendMessage: (payload: {
    toUserId: string
    content: string
  }) => Promise<ConversationBase>
}

interface MyProfileStore {
  myProfile: UserProfile
  isMyProfileLoading: boolean
  initializeMyProfile: () => Promise<boolean>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  setMyProfile: setValue<Partial<UserProfile>>
  uploadMyProfile: (data: Partial<UserProfile>) => Promise<void>
}

export const useStore = create<LeanCloudStore & RealtimeStore & MyProfileStore>(
  (set, get) => ({
    isAuthenticated: false,
    setIsAuthenticated: isAuthenticated => {
      set(() => ({ isAuthenticated }))
    },
    async logout() {
      await LC.User.logOut()
      set(() => ({ isAuthenticated: false }))

      document.location.href = '/' // TODO: use router and proper cleanup to avoid reloading the page
    },
    getEditableACL: () => {
      const ACL = new LC.ACL()
      ACL.setPublicReadAccess(true)
      ACL.setWriteAccess(LC.User.current(), true)
      return ACL
    },
    getReadonlyACL: () => {
      const ACL = new LC.ACL()
      ACL.setPublicReadAccess(true)
      ACL.setPublicWriteAccess(false)
      return ACL
    },

    realtimeClient: null as unknown as IMClient,
    initializeRealtimeClient: async () => {
      const realtime = initializeRealtime()
      const realtimeClient = await realtime.createIMClient(LC.User.current())
      set(() => ({ realtimeClient }))
      return realtimeClient
    },
    sendMessage: async ({ toUserId, content }) => {
      const { realtimeClient } = get()
      const conversation = await realtimeClient.createConversation({
        members: [toUserId],
        unique: true,
        attributes: {
          type: 'private',
        },
      })
      const textMessage = new TextMessage(content)
      await conversation.send(textMessage)
      return conversation
    },

    myProfile: null as unknown as UserProfile,
    isMyProfileLoading: false,
    initializeMyProfile: async () => {
      try {
        const currentUser = LC.User.current()
        if (!currentUser) throw new Error('currentUser is not initialized')

        const profileQuery = await new LC.Query('UserProfile')
          .equalTo('User', currentUser)
          .include('pictures')
          .first()
        if (!profileQuery) throw new Error('profileQuery is not created')
        const profile = profileQuery?.toJSON()
        profile.pictures = profileQuery?.get('pictures')
        set(() => ({ myProfile: profile, isMyProfileLoading: false }))
        return true
      } catch (error) {
        set(() => ({ isMyProfileLoading: false }))
        return false
      }
    },

    updateProfile: async data => {
      await get().uploadMyProfile(data)
      get().setMyProfile(data)
    },

    setMyProfile: data => {
      set(({ myProfile }) => {
        const newProfile = { ...myProfile }
        Object.keys(data).map(key => {
          newProfile[key] = data[key]
        })

        return { myProfile: newProfile }
      })
    },

    uploadMyProfile: async data => {
      const currentUser = LC.User.current()
      if (!currentUser) throw new Error('currentUser is not initialized')

      const profile = await new LC.Query('UserProfile')
        .equalTo('User', currentUser)
        .first()

      Object.keys(data).forEach(key => {
        if (key === 'birthDay') {
          data[key] = new Date(data[key] as string)
        }
        profile?.set(key, data[key])
      })

      await profile?.save()
    },
  }),
)

interface NavBarUI {
  isHideNavBar: boolean
  setIsHideNavBar: (bool: boolean) => void
}

export const useGlobalUI = create<NavBarUI>((set) => ({
  isHideNavBar: false,
  setIsHideNavBar: bool => {
    set(() => ({ isHideNavBar: bool }))
  },
}))
