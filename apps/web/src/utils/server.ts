import type { Sandbox, UserIdentity, UserProfile } from '#/types'
import { memoizeWithArg } from './index'

export const fetchUserProfile = memoizeWithArg<Promise<UserProfile>, string>(
  async (id: string): Promise<UserProfile> => {
    const res = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/profile/${id}`)
    return await res.json()
  }
)

export const fetchUserIdentity = memoizeWithArg<Promise<UserIdentity>, string>(
  async (id) => {
    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_HOST}/profile/${id}?compact=1`,
    ).then(res => res.json())
    return res
  }
)

export function fetchSandbox(id: string): Promise<Sandbox>
export function fetchSandbox(): Promise<Sandbox[]>
export async function fetchSandbox(id?: string) {
  const apiPath = `${import.meta.env.VITE_PUBLIC_HOST}/sandbox${id ? '/' + id : ''}`
  const data = await fetch(apiPath).then(res => res.json())
  return data
}