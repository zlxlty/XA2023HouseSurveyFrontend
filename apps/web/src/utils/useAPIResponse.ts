import useSWR from 'swr'
import omit from 'lodash/omit'
import merge from 'lodash/merge'
import { getSessionToken } from '#/utils/session'

interface RequestConfig {
  init?: Omit<RequestInit, 'headers'>
  headers?: Record<string, string | undefined>
  needSession: boolean
}

export const requestAPI = async <Data = any>(
  path: string,
  config: RequestConfig = { needSession: false },
) => {
  const mergedHeaders: HeadersInit = {
    'content-type': 'application/json',
  }
  if (config.needSession) {
    const sessionToken = getSessionToken()
    mergedHeaders['session-token'] = sessionToken
  }

  const options: RequestInit = merge(
    {
      headers: merge(mergedHeaders, config?.headers),
      cache: 'no-cache' as const,
    },
    omit(config?.init, 'headers'),
  )


  const r = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}${path}`, options)
  if (r.status < 200 || r.status >= 400) throw new Error('failed to fetch')
  return await (r.json() as Promise<Data>)
}

export const useAPIResponse = <Data = any>(
  path: string | null,
  config: RequestConfig = { needSession: false }
) => {
  return useSWR<Data>(path, async path => {
    return await requestAPI<Data>(path, config)
  })
}