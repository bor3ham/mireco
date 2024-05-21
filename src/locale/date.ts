import { parse, format, isValid } from 'date-fns'

import { type DateInputValue, dateValueAsDate, dateAsDateValue } from 'types'
import { getSafeLocale } from 'constants'
import { expandPatterns, DELIMETERS, SPACES } from './utils'

function expandDatePatterns(patterns: string[]): string[] {
  let expanded = patterns
  expanded = expandPatterns(expanded, 'd', ['do'])
  expanded = expandPatterns(expanded, 'M', ['MM', 'MMM', 'MMMM'])
  expanded = expandPatterns(expanded, 'yy', ['yyyy'])
  return expanded
}

const LITTLE_ENDIAN_PATTERNS = expandDatePatterns([
  'd',
  'd M',
  'd M yy'
])
const MIDDLE_ENDIAN_PATTERNS = expandDatePatterns([
  'd',
  'M d',
  'M d yy'
])

const DATE_PARSE_PATTERNS: Record<string, string[]> = {
  'en-AU': LITTLE_ENDIAN_PATTERNS,
  'en-GB': LITTLE_ENDIAN_PATTERNS,
  'en-US': MIDDLE_ENDIAN_PATTERNS,
}

const DATE_DISPLAY_FORMATS: Record<string, string> = {
  'en-AU': 'dd/MM/yyyy',
  'en-GB': 'dd/MM/yyyy',
  'en-US': 'MM/dd/yyyy',
}

export const DATE_PLACEHOLDERS: Record<string, string> = {
  'en-AU': 'dd/mm/yyyy',
  'en-GB': 'dd/mm/yyyy',
  'en-US': 'mm/dd/yyyy',
}

export function formatDate(value: DateInputValue, locale?: string): string {
  if (!value) return ''
  const safeLocale = getSafeLocale(locale)
  return format(dateValueAsDate(value), DATE_DISPLAY_FORMATS[safeLocale])
}

export function parseDate(value: string, locale?: string): DateInputValue {
  const cleaned = value.replace(DELIMETERS, ' ').replace(SPACES, ' ').trim()
  if (cleaned.length <= 0) return null
  const safeLocale = getSafeLocale(locale)
  for (let i = 0; i < DATE_PARSE_PATTERNS[safeLocale].length; i++) {
    const pattern = DATE_PARSE_PATTERNS[safeLocale][i]
    const parsed = parse(cleaned, pattern, new Date())
    if (isValid(parsed)) {
      return dateAsDateValue(parsed)
    }
  }
  return undefined
}
