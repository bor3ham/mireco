import { format, addMilliseconds, startOfDay, isValid, parse } from 'date-fns'

import type { Empty } from './empty'
import { isEmpty } from './empty'

export type TimeValue = number

export type TimeInputValue = TimeValue | Empty

export function isTimeValue(value: TimeInputValue): boolean {
  return !isEmpty(value && !isNaN(value))
}

export function formatTime(value: TimeInputValue, inputFormats: string[], longFormat: string, displayFormat: string): string {
  if (!isTimeValue(value)) {
    return ''
  }
  let adjustedValue = value as number
  adjustedValue = +addMilliseconds(startOfDay(new Date()), adjustedValue)
  let longFormatted = format(adjustedValue, longFormat)
  let displayFormatted = format(adjustedValue, displayFormat)
  let longParsed = parseTime(longFormatted, inputFormats)
  let shortParsed = parseTime(displayFormatted, inputFormats)
  if (longParsed === shortParsed) {
    return displayFormatted
  }
  else {
    return longFormatted
  }
}

export function parseTime(textValue: string, inputFormats: string[]): TimeInputValue {
  let trimmed = textValue.trim()
  // todo: remove superfluous spaces
  if (trimmed.length === 0) {
    return null
  }
  let valid: TimeInputValue = undefined
  inputFormats.map((format) => {
    if (isTimeValue(valid)) {
      return
    }
    let parsed = parse(trimmed, format, startOfDay(new Date()))
    if (isValid(parsed)) {
      valid = +parsed
      valid -= +startOfDay(new Date())
    }
  })
  return valid
}
