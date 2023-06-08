import { format, addMilliseconds, startOfDay, isValid, parse } from 'date-fns'

import type { Empty } from './empty'
import { isEmpty } from './empty'

export type TimeValue = number

export type TimeInputValue = TimeValue | Empty

export function isTimeValue(value: TimeInputValue): boolean {
  return !isEmpty(value && !Number.isNaN(value))
}

export function parseTime(textValue: string, inputFormats: string[]): TimeInputValue {
  const trimmed = textValue.trim()
  // todo: remove superfluous spaces
  if (trimmed.length === 0) {
    return null
  }
  let valid: TimeInputValue
  inputFormats.forEach((inputFormat) => {
    if (isTimeValue(valid)) {
      return
    }
    const parsed = parse(trimmed, inputFormat, startOfDay(new Date()))
    if (isValid(parsed)) {
      valid = +parsed
      valid -= +startOfDay(new Date())
    }
  })
  return valid
}

export function formatTime(value: TimeInputValue, inputFormats: string[], longFormat: string, displayFormat: string): string {
  if (!isTimeValue(value)) {
    return ''
  }
  let adjustedValue = value as number
  adjustedValue = +addMilliseconds(startOfDay(new Date()), adjustedValue)
  const longFormatted = format(adjustedValue, longFormat)
  const displayFormatted = format(adjustedValue, displayFormat)
  const longParsed = parseTime(longFormatted, inputFormats)
  const shortParsed = parseTime(displayFormatted, inputFormats)
  if (longParsed === shortParsed) {
    return displayFormatted
  }
  return longFormatted
}
