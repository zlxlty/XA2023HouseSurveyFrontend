import LC from 'leancloud-storage';

export const getSessionToken = () => {
  return LC.User.current().getSessionToken()
}
