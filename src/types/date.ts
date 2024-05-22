import { parse, format } from 'date-fns'

import { ISO_8601_DATE_FORMAT } from 'constants'
import { isEmpty } from './empty'
import type { InputValue } from './empty'

export type DateValue = string // ISO8601 formatted date eg: '2023-02-18'

export type DateInputValue = InputValue<DateValue>

export function isDateValue(value: DateInputValue): boolean {
  return !isEmpty(value)
}

export function dateValueAsDate(value: DateValue): Date {
  return parse(value, ISO_8601_DATE_FORMAT, new Date())
}

export function dateAsDateValue(date: Date): DateValue {
  return format(date, ISO_8601_DATE_FORMAT)
}

export type DateParseFunction = (value: string, locale?: string) => DateInputValue

export type DateFormatFunction = (value: DateInputValue, locale?: string) => string
