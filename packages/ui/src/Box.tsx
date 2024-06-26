import React from 'react'
import { Card, Image } from '@nextui-org/react'
import clsx from 'clsx'

type Size = {
  w?: string
  h?: string
}

export function BoxCard({
  size,
  isPressable = true,
  children,
}: {
  size?: Size
  isPressable?: boolean
  children: React.ReactNode
}) {
  return (
    <Card
      css={{ ...size, borderRadius: 24 }}
      isPressable={isPressable}
      variant="flat"
      className="ui-shadow-neumorphism ui-border-none ui-bg-none"
    >
      <Card.Body
        css={{ padding: 20 }}
        className="ui-bg-white ui-bg-gradient-to-br ui-from-cloud/30 ui-to-cloud/10"
      >
        {children}
      </Card.Body>
    </Card>
  )
}

export function ProfileCard({
  title,
  children,
  className,
  icon,
}: {
  title: string
  children: React.ReactNode
  className?: string
  icon?: () => JSX.Element
}) {
  return (
    <div className={clsx('ui-w-full ui-flex', className)}>
      <BoxCard>
        <div className="ui-flex ui-justify-between ui-items-center">
          <p className="ui-text-sm ui-font-semibold ui-text-gray-800">{title}</p>
          {icon && icon()}
        </div>
        {children}
      </BoxCard>
    </div>
  )
}

export function ProfileImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={clsx('ui-w-full ui-flex', className)}>
      <Card
        css={{ borderRadius: 24 }}
        isPressable
        variant="flat"
        className="ui-shadow-neumorphism ui-border-none"
      >
        <Card.Body css={{ padding: 0 }}>
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="100%"
            objectFit="cover"
            autoResize
          />
        </Card.Body>
      </Card>
    </div>
  )
}
