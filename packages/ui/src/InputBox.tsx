import clsx from 'clsx'
import { useState } from 'react'
import React from 'react'

interface InputBoxProps {
  callback?: (value: string) => void
  placeholder?: string
  className?: string
  transferInputValue?: (value: string) => void
  maxLength?: number
}

export function InputBox({
  callback,
  placeholder,
  className,
  transferInputValue,
  maxLength,
}: InputBoxProps) {
  const [inputValue, setInputValue] = useState<string>('')

  const innerShadow = 'ui-shadow-neumorphism-inner'
  const outerShadow = 'ui-shadow-neumorphism'
  const [inputStyle, setInputStyle] = useState(innerShadow)
  const [showPlaceHolder, setShowPlaceHolder] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    transferInputValue && transferInputValue(newValue)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!callback) return
    if (e.key === 'Enter') {
      if (inputValue.trim().length) {
        const content = inputValue
        callback(content)
      }
      setInputValue('')
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowPlaceHolder(false)
    setInputStyle(outerShadow)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowPlaceHolder(true)
    setInputStyle(innerShadow)
  }

  return (
    <input
      className={clsx(
        'ui-w-full ui-h-full ui-text-left ui-border-0 ui-px-4 ui-rounded-full ui-bg-gradient-to-b ui-from-[#F2F5FF] ui-to-[#DCE0EF] focus:ui-outline-none ui-text-gray-50/70',
        inputStyle,
        className,
      )}
      type="textarea"
      value={inputValue}
      placeholder={showPlaceHolder ? placeholder : ''}
      maxLength={maxLength}
      onChange={handleInputChange}
      onKeyUp={handleKeyUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      enterKeyHint="done"
    />
  )
}