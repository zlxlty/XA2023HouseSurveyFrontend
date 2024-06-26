import { useStore, useGlobalUI } from '#/stores'
import { useLocation } from 'react-router-dom'
import Image from '#/components/next-image'
import { parsePathname } from '#/utils'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { UnreadBadgeBoundary, MatchBadgeBoundary } from './badges'

interface Tab {
  segment: string
  icon: string
  activeIcon: string
  text: string
  badgeBoundary?: typeof UnreadBadgeBoundary
}

const tabs: Tab[] = [
  {
    segment: '/chat-list',
    icon: '/icons/nav-chat.svg',
    activeIcon: '/icons/nav-chat-active.svg',
    text: '联系',
    badgeBoundary: UnreadBadgeBoundary,
  },
  {
    segment: '/match',
    icon: '/icons/nav-match.svg',
    activeIcon: '/icons/nav-match-active.svg',
    text: '推荐',
    badgeBoundary: MatchBadgeBoundary,
  },
  {
    segment: '/discover',
    icon: '/icons/nav-discover.svg',
    activeIcon: '/icons/nav-discover-active.svg',
    text: '探索',
  },
  // {
  //   segment: "/moment",
  //   icon: momentIcon,
  //   activeIcon: momentActiveIcon,
  //   text: "动态",
  // },
  {
    segment: '/mirro',
    icon: '/icons/nav-mirro.svg',
    text: '镜身',
    activeIcon: '/icons/nav-mirro-active.svg',
  },
]

export default function GlobalNav({ className }: { className: string }) {
  const { pathname } = useLocation()
  const isAuthenticated = useStore(state => state.isAuthenticated)
  const isHideNavBar = useGlobalUI(state => state.isHideNavBar)
  const [segment] = parsePathname(pathname)

  const isShowing = handleIsShowing()

  function handleIsShowing() {
    if (!isAuthenticated) return false
    switch (segment) {
      case 'chat-list':
        return true
      case 'match':
        return true
      case 'discover':
        return true
      case 'moment':
        return true
      case 'mirro':
        return true
      default:
        return false
    }
  }

  if (isHideNavBar) return null

  return (
    <nav
      className={clsx(
        { 'invisible pointer-events-none': !isShowing },
        'flex justify-around items-center bg-gradient-to-b from-white/60 to-white/80 backdrop-blur px-6 select-none',
        className,
      )}
    >
      {tabs.map(tab => (
        <div className="relative" key={tab.segment}>
          {tab.badgeBoundary ? (
            <tab.badgeBoundary>
              <NavItem
                key={tab.segment}
                tab={tab}
                isActive={tab.segment === `/${segment}`}
              />
            </tab.badgeBoundary>
          ) : (
            <NavItem
              key={tab.segment}
              tab={tab}
              isActive={tab.segment === `/${segment}`}
            />
          )}
        </div>
      ))}
    </nav>
  )
}

function NavItem({
  tab: { segment, icon, activeIcon, text },
  isActive,
}: {
  tab: Tab
  isActive: boolean
}) {
  return (
    <Link
      to={segment}
      replace
      className={clsx(
        { 'shadow-neumorphism-inner bg-gradient-to-t from-transparent via-white/20 to-white': isActive },
        'h-16 w-16 rounded-2xl flex items-center justify-center select-none',
      )}
    >
      <div className="h-full w-full p-2.5 flex flex-col items-center justify-between pointer-events-none">
        <Image src={isActive ? activeIcon : icon} alt={segment} />
        <p
          className={clsx(
            isActive ? 'text-[#8CA5FF]' : 'text-[#8F9BB3]',
            'text-xs scale-[.8]',
          )}
        >
          {text}
        </p>
      </div>
    </Link>
  )
}