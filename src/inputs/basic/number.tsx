import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import type { NumberValue } from 'types'

import { Text } from './text'
import { KEYBOARD_ARROW_DOWN, KEYBOARD_ARROW_UP } from 'constants'

function formatValue(value: NumberValue): string {
  if (typeof value === 'number') {
    return `${value}`
  }
  return ''
}

function parseValue(textValue: string, min?: number, max?: number, step?: number): NumberValue {
  const trimmed = textValue.trim()
  if (trimmed.length === 0) {
    return null
  }
  const parsed = parseFloat(trimmed)
  if (isNaN(parsed)) {
    return undefined
  }
  if (typeof step === 'number') {
    if (parsed % step !== 0) {
      return undefined
    }
  }
  if (typeof min === 'number' && parsed < min) {
    return undefined
  }
  if (typeof max === 'number' && parsed > max) {
    return undefined
  }
  return parsed
}

interface NumberProps {
  // mireco
  block?: boolean
  // number
  value?: NumberValue
  onChange?(value: NumberValue): void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  size?: number
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string
  // form
  name?: string
  required?: boolean
  disabled?: boolean
  // event handlers
  onFocus?(event?: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLInputElement>): void
  onClick?(event: React.MouseEvent<HTMLInputElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLInputElement>): void  
  onMouseMove?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLInputElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLInputElement>): void
}

const NumberInput: React.FC<NumberProps> = ({
  block,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  size,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  name,
  required,
  disabled,
  onFocus,
  onBlur,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onKeyDown,
  onKeyUp,
}) => {
  const [textValue, setTextValue] = useState(formatValue(value))
  useEffect(() => {
    if (
      typeof value !== 'undefined' &&
      parseValue(textValue, min, max, step) != value
    ) {
      setTextValue(formatValue(value))
    }
  }, [value, textValue, min, max, step])
  const handleTextChange = useCallback((newValue: string) => {
    if (typeof onChange === 'function') {
      setTextValue(newValue)
      onChange(parseValue(newValue, min, max, step))
    }
  }, [onChange, min, max, step])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which === KEYBOARD_ARROW_DOWN || event.which === KEYBOARD_ARROW_UP) {
      event.preventDefault()
      if (typeof onChange !== 'function') {
        return
      }
      const current = typeof value === 'number' ? value : 0
      const currentStep = typeof step === 'number' ? step : 1
      if (event.which === KEYBOARD_ARROW_UP) {
        const next = current + currentStep
        if (typeof max !== 'number' || next <= max) {
          onChange(next)
        }
      }
      if (event.which === KEYBOARD_ARROW_DOWN) {
        const next = current - currentStep
        if (typeof min !== 'number' || next >= min) {
          onChange(next)
        }
      }
    }
    if (typeof onKeyDown === 'function') {
      onKeyDown(event)
    }
  }, [
    onChange,
    value,
    step,
    max,
    min,
    onKeyDown,
  ])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const stringified = formatValue(value)
    setTextValue(stringified)
    if (typeof onBlur === 'function') {
      onBlur(event)
    }
  }, [
    value,
    onBlur,
  ])

  return (
    <Text
      block={block}
      value={textValue}
      onChange={handleTextChange}
      placeholder={placeholder}
      id={id}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={style}
      className={classNames(
        'MIRECO-number',
        className,
      )}
      title={title}
      name={name}
      required={required}
      disabled={disabled}
      size={size}
      onFocus={onFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
    />
  )
}

export { NumberInput as Number }
