import { parse, format, isValid } from 'date-fns'

import { ISO_8601_DATE_FORMAT } from 'constants'
import { isEmpty } from './empty'
import type { Empty } from './empty'

export type DateValue = string // ISO8601 formatted date eg: '2023-02-18'

export type DateInputValue = DateValue | Empty

export function isDateValue(value: DateInputValue): boolean {
  return !isEmpty(value)
}

export function formatDate(value: DateInputValue, displayFormat: string): string {
  if (!isDateValue(value)) {
    return ''
  }
  return format(parse(value as DateValue, ISO_8601_DATE_FORMAT, new Date()), displayFormat)
}

export function parseDate(textValue: string, inputFormats: string[]): DateInputValue {
  let trimmed = textValue.trim()
  if (trimmed.length === 0) {
    return null
  }
  trimmed = trimmed.replace(/\\/g, '/') // replace backslashes with forward
  trimmed = trimmed.replace(/ /g, '/') // replace spaces with slashes
  trimmed = trimmed.replace(/\/+/g, '/') // merge several slashes into one
  trimmed = trimmed.replace(/\/+$/, '') // remove trailing slashes from consideration

  let valid: DateInputValue
  inputFormats.forEach((inputFormat) => {
    if (typeof valid !== 'undefined') {
      return
    }
    const parsed = parse(trimmed, inputFormat, new Date())
    if (isValid(parsed)) {
      valid = format(parsed, ISO_8601_DATE_FORMAT)
    }
  })
  return valid
}

export function dateValueAsDate(value: DateValue): Date {
  return parse(value, ISO_8601_DATE_FORMAT, new Date())
}

export function dateAsDateValue(date: Date): DateValue {
  return format(date, ISO_8601_DATE_FORMAT)
}
