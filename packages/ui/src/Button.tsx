import React from 'react'

type Color = 'white' | 'gradient'

export function RoundedButton({
  className,
  children,
  color,
  onClick = () => {},
}: {
  className?: string
  children: React.ReactNode
  color: Color
  onClick?: () => void
}) {
  let buttonStyle = 'white-button text-[#36597D]'
  switch (color) {
    case 'white':
      buttonStyle = 'white-button text-[#36597D]'
      break
    case 'gradient':
      buttonStyle = 'gradient-button text-gray-50'
      break
  }
  return (
    <button
      onClick={onClick || (() => {})}
      className={`ui-rounded-full ${buttonStyle} ${className}`}
    >
      {children}
    </button>
  )
}

export function PrimaryButton({
  text,
  onClick,
}: {
  text: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="ui-shadow-neumorphism rounded-full">
      <p>{text}</p>
    </button>
  )
}
