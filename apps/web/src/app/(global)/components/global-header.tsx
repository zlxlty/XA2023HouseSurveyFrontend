import staticHeaderMap from '#/assets/static-header-map.json'
import Image from '#/components/next-image'
import { useStore } from '#/stores'
import { parsePathname } from '#/utils'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import React, { CSSProperties, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface StaticHeader {
  staticTitle: string
  description: string
  hasBackButton: boolean
}

interface DynamicHeader {
  payload: React.ReactNode
  component: React.ReactNode
  hasBackButton: boolean
}

type Header = StaticHeader | DynamicHeader

export default function GlobalHeader({
  title,
  description,
  hasBackButton = false,
  payload,
  component,
  className,
  style,
}: {
  title?: string
  description?: string
  hasBackButton?: boolean
  payload?: React.ReactNode
  component?: React.ReactNode
  className?: string
  style?: CSSProperties
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const isAuthenticated = useStore(state => state.isAuthenticated)

  const path = useMemo(() => {
    const [segment, param] = parsePathname(pathname)
    return { segment, param }
  }, [pathname])

  const header = useMemo<Header>(() => {
    if (title && description) {
      return {
        staticTitle: title as string,
        description,
        hasBackButton,
      }
    }
    if (payload) {
      return {
        payload,
        component,
        hasBackButton,
      }
    }
    switch (true) {
      // '/match':
      case path.segment === 'match':
        return {
          payload: <TabForMatch />,
          component: null,
          hasBackButton: false,
        }

      // 'chat/id':
      case path.segment === 'chat' && !!path.param:
        return null as unknown as Header

      // '/':
      case !path.segment:
        return null as unknown as Header

      // '/match','/chat','/profile-settings','/profile/id'
      default:
        return (staticHeaderMap as any)[path.segment] as StaticHeader
    }
  }, [pathname, title, payload])

  function routerBack() {
    const historyRouteCount = history.length
    if (historyRouteCount > 2) navigate(-1)
    else navigate('/mirro')
  }

  return (
    <>
      {header && (
        <header
          className={clsx(
            { invisible: !isAuthenticated },
            'bg-gradient-to-b from-white via-white/80 w-full backdrop-blur-sm space-y-1 p-6 pb-2 text-2xl',
            className,
          )}
          style={style}
        >
          <div className="w-full flex justify-between items-center">
            <section className="flex justify-center items-center gap-3">
              {header.hasBackButton && (
                <motion.button
                  onTap={routerBack}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src="/icons/back.svg"
                    alt="Mirro"
                    width={45}
                    height={45}
                    style={{ height: 'auto', width: 'auto' }}
                  />
                </motion.button>
              )}
              {'staticTitle' in header ? (
                <p className="select-none">{header.staticTitle}</p>
              ) : (
                <>{header.payload}</>
              )}
            </section>

            <Image
              src="/logo.svg"
              alt="Mirro"
              width={45}
              height={45}
              style={{ height: 'auto', width: 'auto' }}
            />
          </div>
          {'description' in header && (
            <p className="text-gray-800/50 text-sm select-none">
              {header.description}
            </p>
          )}

          {'component' in header && (
            <div className="pt-1">{header.component}</div>
          )}
        </header>
      )}
    </>
  )
}

function TabForMatch() {
  return <div className="flex gap-4">偶遇</div>
}
