import { AuthStateEffector } from '#/app/(global)/components/AuthStateEffector'
import PageLoading from '#/components/page-loading'
import { NextUIProvider } from '@nextui-org/react'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import Router from './router'

export default function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <SWRConfig value={{ suspense: true }}>
            <AuthStateEffector />
            <Router />
          </SWRConfig>
        </Suspense>
      </BrowserRouter>
    </NextUIProvider>
  )
}
