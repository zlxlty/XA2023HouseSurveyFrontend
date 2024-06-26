import { useStore } from '#/stores'
import { MirroPlugin } from '#/utils/capacitor/plugin/wrap'
import { useEffect } from 'react'
import LC from 'leancloud-storage'

export const AuthStateEffector = () => {
  const [isAuthenticated] = useStore(state => [
    state.isAuthenticated,
  ])

  useEffect(() => {
    if (isAuthenticated) {
      MirroPlugin.notifyAuthStateUpdated({
        isAuthenticated: true,
        user: LC.User.current().toJSON(),
        sessionToken: LC.User.current().getSessionToken(),
      })
    } else {
      MirroPlugin.notifyAuthStateUpdated({
        isAuthenticated: false,
      })
    }
  }, [isAuthenticated])

  return null
}
