import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import humanizeDuration from 'humanize-duration'
import parseDuration from 'parse-duration'
import type { Unit } from 'humanize-duration'

// simplify large units rather than exact
parseDuration.month = parseDuration.week * 4
parseDuration.year = parseDuration.week * 52

import { WidgetText } from 'components'
import { HourglassVector } from 'vectors'
// import { usePrevious } from '../../hooks'
import type { DurationValue } from 'types'
import { KEYBOARD_ARROW_UP, KEYBOARD_ARROW_DOWN } from 'constants'

function formatValue(value: DurationValue, humaniseUnits: Unit[]): string {
  let formatted = ''
  if (typeof value === 'number') {
    formatted = humanizeDuration(value, {
      units: humaniseUnits,
    })
  }
  return formatted
}

function parseValue(value: string, defaultTimeUnit: string): DurationValue {
  let trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }
  if (trimmed.replace(/[^\d.,-]/g, '') === trimmed) {
    trimmed += ` ${defaultTimeUnit}`
  }

  const parsed = parseDuration(trimmed)
  if (parsed === 0 && trimmed[0] !== '0') {
    return undefined
  }
  return Math.floor(parsed)
}

export interface DurationProps {
  // mireco
  block?: boolean
  // duration
  value?: DurationValue
  onChange?(newValue: DurationValue, wasBlur: boolean): void
  humaniseUnits?: Unit[]
  incrementUnits?: number[]
  defaultTimeUnit?: string
  placeholder?: string
  // html
  id?: string
  className?: string
  style?: React.CSSProperties
  // form
  disabled?: boolean
  required?: boolean
}

export const Duration: React.FC<DurationProps> = ({
  block,
  value,
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
  id,
  className,
  style,
  disabled,
  required,
}) => {
  const [textValue, setTextValue] = useState(formatValue(value, humaniseUnits))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'number') {
      const parsedCurrent = parseValue(textValueRef.current, defaultTimeUnit)
      if (parsedCurrent !== value) {
        setTextValue(formatValue(value, humaniseUnits))
      }
    }
  }, [value, defaultTimeUnit])
  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseValue(newValue, defaultTimeUnit), false)
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
    if (event) {
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
            onChange(parseValue(`1 ${defaultTimeUnit}`, defaultTimeUnit), false)
          }
        }
      }
    }
  }, [onChange, value, bestIncrement])
  const handleTextBlur = useCallback(() => {
    setTextValue(formatValue(value, humaniseUnits))
    if (onChange) {
      onChange(value, true)
    }
  }, [value, onChange])
  return (
    <WidgetText
      id={id}
      value={textValue}
      onChange={handleTextChange}
      onBlur={handleTextBlur}
      block={block}
      placeholder={placeholder}
      onKeyDown={handleTextKeyDown}
      disabled={disabled}
      className={classNames(
        'MIRECO-duration',
        className,
      )}
      style={style}
      icon={<HourglassVector />}
      required={required}
    />
  )
}
