import LC from 'leancloud-storage'

export interface MirroPlugin {
  notifyAuthStateUpdated(options: NotifyAuthStateUpdatedOptions): Promise<void>
  notifyUnreadCount(options: { count: number }): Promise<void>
  shareToWechat(options: ShareToWechatOptions): Promise<void>
}

export interface NotifyAuthStateUpdatedOptions {
  isAuthenticated: boolean
  user?: LC.User
  sessionToken?: string
}

export interface ShareToWechatOptions {
  title: string
  description: string
}
