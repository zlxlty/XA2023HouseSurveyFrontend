import { registerPlugin } from '@capacitor/core'

import type { MirroPlugin as MirroPluginType } from './definitions'

const MirroPlugin = registerPlugin<MirroPluginType>('MirroPlugin', {
  web: () => import('./web').then(m => new m.MirroWeb()),
})

export { MirroPlugin }
