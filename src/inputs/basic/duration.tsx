import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import type { Unit } from 'humanize-duration'

import { WidgetText } from 'components'
import { HourglassVector } from 'vectors'
import { KEYBOARD_ARROW_UP, KEYBOARD_ARROW_DOWN } from 'constants'
import { formatDuration, parseDuration } from 'types'
import type { DurationInputValue } from 'types'

export interface DurationProps {
  // mireco
  block?: boolean
  // duration
  value?: DurationInputValue
  onChange?(newValue: DurationInputValue, wasBlur: boolean): void
  humaniseUnits?: Unit[]
  incrementUnits?: number[]
  defaultTimeUnit?: string
  placeholder?: string
  size?: number
  // html
  id?: string
  className?: string
  style?: React.CSSProperties
  // form
  disabled?: boolean
  required?: boolean
  // event handlers
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event: React.FocusEvent<HTMLInputElement>): void
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

export const Duration: React.FC<DurationProps> = ({
  block,
  value = null,
  onChange,
  humaniseUnits = [
    'w',
    'd',
    'h',
    'm',
    's',
  ],
  incrementUnits = [
    // 1000, // seconds
    60 * 1000, // minutes
    60 * 60 * 1000, // hours
    24 * 60 * 60 * 1000, // days
    // 7 * 24 * 60 * 60 * 1000, // weeks
    // (365.25 * 24 * 60 * 60 * 1000) / 12, // months
  ],
  defaultTimeUnit = 'hours',
  placeholder,
  size,
  id,
  className,
  style,
  disabled,
  required,
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
  const [textValue, setTextValue] = useState(formatDuration(value, humaniseUnits))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'number') {
      const parsedCurrent = parseDuration(textValueRef.current, defaultTimeUnit)
      if (parsedCurrent !== value) {
        setTextValue(formatDuration(value, humaniseUnits))
      }
    }
  }, [value, defaultTimeUnit])
  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseDuration(newValue, defaultTimeUnit), false)
    }
  }, [])

  const bestIncrement = useCallback((goingUp: boolean) => {
    let incIndex = 0
    if (typeof value === 'number') {
      while (
        (
          (goingUp && value >= incrementUnits[incIndex + 1])
          || (!goingUp && value > incrementUnits[incIndex + 1])
        )
        && incIndex < incrementUnits.length
      ) {
        incIndex += 1
      }
    }
    return incrementUnits[incIndex]
  }, [value, incrementUnits])
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which === KEYBOARD_ARROW_DOWN) {
      event.preventDefault()
      if (onChange) {
        if (typeof value === 'number') {
          onChange(Math.max(value - bestIncrement(false), 0), false)
        }
        else {
          onChange(0, false)
        }
      }
    }
    if (event.which === KEYBOARD_ARROW_UP) {
      event.preventDefault()
      if (onChange) {
        if (typeof value === 'number') {
          onChange(value + bestIncrement(true), false)
        }
        else {
          onChange(parseDuration(`1 ${defaultTimeUnit}`, defaultTimeUnit), false)
        }
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [onChange, value, bestIncrement, onKeyDown])
  const handleTextBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setTextValue(formatDuration(value, humaniseUnits))
    if (onChange) {
      onChange(value, true)
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [value, onChange, onBlur])
  return (
    <WidgetText
      id={id}
      value={textValue}
      block={block}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      className={classNames(
        'MIRECO-duration',
        className,
      )}
      style={style}
      icon={<HourglassVector />}
      required={required}
      onChange={handleTextChange}
      onFocus={onFocus}
      onBlur={handleTextBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={handleTextKeyDown}
      onKeyUp={onKeyUp}
    />
  )
}
