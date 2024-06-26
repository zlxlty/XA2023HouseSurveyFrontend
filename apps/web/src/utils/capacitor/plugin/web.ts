import { WebPlugin } from '@capacitor/core'
import type {
  MirroPlugin,
  NotifyAuthStateUpdatedOptions,
  ShareToWechatOptions,
} from './definitions'

export class MirroWeb extends WebPlugin implements MirroPlugin {
  constructor() {
    super()
  }

  notifyUnreadCount(options: { count: number }): Promise<void> {
    console.info(
      'MirroWeb: notifyUnreadCount on web does not have any valid use cases. This call has been ignored.',
      options,
    )
    return Promise.resolve()
  }

  notifyAuthStateUpdated(
    options: NotifyAuthStateUpdatedOptions,
  ): Promise<void> {
    console.info(
      'MirroWeb: notifyAuthStateUpdated on web does not have any valid use cases. This call has been ignored.',
      options,
    )
    return Promise.resolve()
  }

  shareToWechat(options: ShareToWechatOptions): Promise<void> {
    console.info(
      'MirroWeb: shareToWechat on web does not have any valid use cases. This call has been ignored.',
      options,
    )
    return Promise.resolve()
  }
}
