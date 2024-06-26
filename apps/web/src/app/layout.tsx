import GlobalMain from '#/app/(global)/components/global-main'
import GlobalNav from '#/app/(global)/components/global-nav'
import '#/styles/globals.css'
import { Outlet } from 'react-router-dom'
import 'ui/styles.css'

export default function RootLayout() {
  return (
    <>
      <GlobalMain className="h-full w-full">
        <Outlet />
      </GlobalMain>
      <GlobalNav className="fixed bottom-0 z-50 w-full shadow-neumorphism-reverse py-3 pb-[calc(max(env(safe-area-inset-bottom),0.75rem))]" />
    </>
  )
}
