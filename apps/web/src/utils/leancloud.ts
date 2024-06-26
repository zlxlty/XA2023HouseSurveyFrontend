import { Realtime } from 'leancloud-realtime'
import leancloudStorage, { Queriable, Query } from 'leancloud-storage'
import { memoize } from '#/utils/index'
import LC from 'leancloud-storage';

export interface OtherUser extends Partial<LC.User> {
  followerQuery<OtherUser extends Queriable>(): Query<OtherUser>
  id: string
}

const appConfig = {
  appId: 'fOxe8spe4oyzuzdyFCsCWeWf-9Nh9j0Va',
  appKey: 'P9TrptOClF1fJa31Ye0fRtrU',
}

const serverURL = 'https://lcapi.mirro.hyperex.cc'

export const initializeLC = memoize(() => {
  leancloudStorage.init({
    ...appConfig,
    serverURL,
  })
  return leancloudStorage
})

export const initializeRealtime = memoize(() => {
  return new Realtime({
    ...appConfig,
    server: serverURL,
    noBinary: true,
    RTMServers: ['wss://foxe8spe.rtm.lncldapi.com'],
  })
})
