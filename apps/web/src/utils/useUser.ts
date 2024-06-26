import { getSessionToken } from '#/utils/session'
import useSWR from 'swr'
import LC from 'leancloud-storage';

const userFetcher = async (key: string) => {
  const [, sessionToken] = key.split('::')
  const User = await LC.User.become(sessionToken)
  return User
}

export const useCurrentUser = () => {
  const session = getSessionToken()
  return useSWR(session ? 'currentUser::' + session : null, userFetcher)
}

export const useCurrentUserId = () => {
  return LC.User.current()?.id
}
