import titleMap from '#/assets/column-title-map.json'
import NextImage from '#/components/next-image'
import type { UserProfile } from '#/types'
import { getAgeWithVerify, sigmoidModel, verifyMBTI } from '#/utils'
import { Avatar } from '@nextui-org/react'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import mirroIcon from '#/assets/icons/nav-mirro-white.svg'
import infoIcon from '#/assets/icons/profile-info.svg'
import personIcon from '#/assets/icons/profile-person.svg'
import { InfiniteTagScroll, ProfileCard, ProfileImage, RoundedButton } from 'ui'
import { ReportDialogButton } from '#/components/report-dialog'
import { BlockDialogButton } from '#/components/block-dialog'
import { useCurrentUserId } from '#/utils/useUser'
import { useStore } from '#/stores'
import Paragraph from '#/components/paragraph'

interface HeaderPart {
  avatarURL: UserProfile['avatarURL']
  username: UserProfile['username']
  about: UserProfile['about']
  isPublic: UserProfile['isPublic']
  syncRate: string
}

export default function UserProfileCard({
  userProfile: {
    username,
    birthDay,
    school,
    mbti,
    hometown,
    about,
    avatarURL,
    pictures,
    wish,
    more,
    isPublic,
    tags,
  },
  noPaddingBottom,
  userId,
  children,
}: {
  userProfile: UserProfile
  userId?: string
  noPaddingBottom?: boolean
  children?: React.ReactNode
}) {
  const navigate = useNavigate()
  const currentUserId = useCurrentUserId()
  const [isAuthenticated] = useStore(state => [state.isAuthenticated])
  const age = getAgeWithVerify(birthDay as string)

  const syncRate =
    tags && tags.length ? sigmoidModel(tags.length).toFixed(1) : ''

  const ShortTexts = Object.entries({
    hometown,
    age,
    school: school && school.trim(),
  }).map(([key, value]) =>
    value ? (
      <p key={key}>
        {titleMap[key]} · {value}
      </p>
    ) : null,
  )

  const MBTI = verifyMBTI(mbti) ? (
    <p>
      {titleMap.mbti} · <span className="text-4xl">{mbti.toUpperCase()}</span>
    </p>
  ) : null

  // const statistic = {
  //   follower,
  //   // replyByAI: "***",
  //   tag: tags ? tags.length : 0,
  // };

  // const DataStatistic = Object.entries(statistic).map(([key, value]) => (
  //   <div
  //     key={key}
  //     className="space-y-10 shadow-neumorphism bg-white/50 rounded-2xl p-2 flex-1"
  //   >
  //     <p>{titleMap.statistic[key]}</p>
  //     <p className="text-xl">{value}</p>
  //   </div>
  // ));

  const longTexts = Object.entries({ wish, more }).map(([key, value]) => ({
    title: titleMap[key],
    value: value ? value.trim() : '',
  }))

  const CrossArrangeContent = new Array(pictures.length + longTexts.length)
    .fill(null)
    .reduce((acc, _, index) => {
      if (pictures[index])
        acc.push(
          <ProfileImage
            key={pictures[index].url as string}
            src={pictures[index].url as string}
            alt="image"
          />,
        )

      if (longTexts[index] && longTexts[index].value) {
        acc.push(
          <ProfileCard
            key={longTexts[index].title}
            title={longTexts[index].title}
            icon={PersonIcon}
          >
            <p className="mt-6 text-gray-400">{longTexts[index].value}</p>
          </ProfileCard>,
        )
      }
      return acc
    }, [])

  function ToChatButton() {
    if (!userId) return null

    return (
      <Link
        to={`/chat/private/${userId}`}
        onClick={e => {
          if (!isAuthenticated) {
            e.preventDefault()
            localStorage.setItem('redirectTo', `/profile/${userId}`)
            navigate('/onboarding', { replace: true })
          }
        }}
        className="sticky top-[calc(max(env(safe-area-inset-top),2rem))] z-10 flex justify-center items-center gap-2 rounded-3xl py-3 shadow-neumorphism bg-gradient-to-tr from-[#8F9BB3] to-[#B7DBFF] active:shadow-neumorphism-inner"
      >
        <NextImage src={mirroIcon} alt="mirro" />
        <p className="text-gray-50 text-sm">
          {`和${userId === 'self' ? '自己' : ' Ta '}的镜身聊聊天`}
        </p>
      </Link>
    )
  }

  return (
    <>
      <main className="flex flex-col w-full gap-6 p-8 mt-safe">
        <HeaderPart {...{ avatarURL, username, isPublic, about, syncRate }} />

        <div className="flex flex-col items-stretch gap-6 w-full">
          <ProfileCard key="infos" title="基础信息" icon={InfoIcon}>
            <div className="mt-6 flex justify-between items-end text-xs text-gray-400">
              <div className="leading-5">{ShortTexts}</div>
              {MBTI}
            </div>
          </ProfileCard>

          {children ? (
            <ProfileCard key="meme" title="动态">
              {children}
            </ProfileCard>
          ) : null}

          <ToChatButton />

          {/* {follower ? (
              <ProfileCard key="data" title="数据" icon={PersonIcon}>
                <div className="mt-2 text-xs flex justify-between gap-3 text-gray-400">
                  {DataStatistic}
                </div>
              </ProfileCard>
            ) : null} */}

          {CrossArrangeContent}

          {userId !== currentUserId && userId !== 'self' && (
            <div className="flex justify-end w-full gap-4">
              {userId && <BlockDialogButton blockAgainstUserId={userId} />}
              {userId && <ReportDialogButton reportAgainstUserId={userId} />}
            </div>
          )}
        </div>
      </main>
      {tags && tags.length ? <InfiniteTagScroll tags={tags} /> : null}
      <div className={clsx(noPaddingBottom ? 'pb-10' : 'pb-64')} />
    </>
  )
}

function HeaderPart({
  avatarURL,
  username,
  isPublic,
  about,
  syncRate,
}: HeaderPart) {
  return (
    <div>
      <div className="float-right ml-4 mb-2 flex flex-col justify-center items-center gap-2">
        <Avatar
          squared
          src={avatarURL}
          alt={username}
          color={isPublic ? 'gradient' : 'default'}
          bordered={isPublic}
          zoomed
          css={{ w: '6rem', h: '6rem' }}
          className="object-cover shadow-neumorphism"
        />
        {!isPublic && syncRate ? (
          <RoundedButton color="gradient" className="scale-90">
            <p className="px-4 py-1 whitespace-nowrap text-xs scale-90">
              同步率: {`${syncRate}%`}
            </p>
          </RoundedButton>
        ) : null}
      </div>
      <div
        className={
          about.length > 80
            ? 'inline space-y-4'
            : 'h-24 gap-4 flex flex-col justify-between'
        }
      >
        <p className="text-lg">{username}</p>
        <p className="text-xs text-gray-500"><Paragraph content={about} /></p>
      </div>
    </div>
  )
}

function InfoIcon() {
  return <NextImage src={infoIcon} alt="info" />
}

function PersonIcon() {
  return <NextImage src={personIcon} alt="info" />
}
