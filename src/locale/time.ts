import { format, addMilliseconds, startOfDay, isValid, parse } from 'date-fns'

import { isTimeValue, type TimeInputValue } from 'types'
import { getSafeLocale } from 'constants'
import { DELIMETERS, SPACES } from './utils'

const TWELVE_HR_PATTERNS = [
  'h mm ss a',
  'h mm ssa',
  'h mm ss',
  'h mm a',
  'H mm ss',
  'H mm',
  'h mma',
  'h mm',
  'h a',
  'H mm',
  'H',
  'ha',
  'h',
]

const TIME_PARSE_PATTERNS: Record<string, string[]> = {
  'en-AU': TWELVE_HR_PATTERNS,
  'en-GB': TWELVE_HR_PATTERNS,
  'en-US': TWELVE_HR_PATTERNS,
}

const TIME_LONG_FORMATS: Record<string, string> = {
  'en-AU': 'h:mm:ss a',
  'en-GB': 'h:mm:ss a',
  'en-US': 'h:mm:ss a',
}

const TIME_DISPLAY_FORMATS: Record<string, string> = {
  'en-AU': 'h:mm a',
  'en-GB': 'h:mm a',
  'en-US': 'h:mm a',
}

export const TIME_PLACEHOLDERS: Record<string, string> = {
  'en-AU': 'hh:mm',
  'en-GB': 'hh:mm',
  'en-US': 'hh:mm',
}

export function formatTime(value: TimeInputValue, locale?: string, simplify?: boolean): string {
  if (!isTimeValue(value)) {
    return ''
  }
  const safeLocale = getSafeLocale(locale)

  let adjustedValue = value as number
  adjustedValue = +addMilliseconds(startOfDay(new Date()), adjustedValue)
  const longFormatted = format(adjustedValue, TIME_LONG_FORMATS[safeLocale])
  const displayFormatted = format(adjustedValue, TIME_DISPLAY_FORMATS[safeLocale])
  const longParsed = parseTime(longFormatted, locale)
  const shortParsed = parseTime(displayFormatted, locale)
  if (longParsed === shortParsed || simplify) {
    return displayFormatted
  }
  return longFormatted
}

export function parseTime(value: string, locale?: string): TimeInputValue {
  const cleaned = value.replace(DELIMETERS, ' ').replace(SPACES, ' ').trim()
  if (cleaned.length === 0) {
    return null
  }

  const safeLocale = getSafeLocale(locale)
  for (let i = 0; i < TIME_PARSE_PATTERNS[safeLocale].length; i++) {
    const parsed = parse(cleaned, TIME_PARSE_PATTERNS[safeLocale][i], startOfDay(new Date()))
    if (isValid(parsed)) {
      let valid = +parsed
      valid -= +startOfDay(new Date())
      return valid
    }
  }
  return undefined
}
