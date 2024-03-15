import { format, startOfDay, parse } from 'date-fns'

import type { Empty } from './empty'
import { isEmpty } from './empty'
import type { DateInputValue, DateValue } from './date'
import type { TimeInputValue } from './time'
import { ISO_8601_DATE_FORMAT } from 'constants'

export type DatetimeValue = number // epoch ms eg: 1686116893002

export type DatetimeInputValue = DatetimeValue | Empty

export function isDatetimeValue(value: DatetimeInputValue): boolean {
  return !isEmpty(value) && !Number.isNaN(value!)
}

export const splitDatetimeValue = (value: DatetimeInputValue): {
  date: DateInputValue
  time: TimeInputValue
} => {
  if (typeof value === 'undefined') return {
    date: undefined,
    time: undefined,
  }
  if (value === null) return {
    date: null,
    time: null,
  }
  const asDate = new Date(value)
  return {
    date: format(asDate, ISO_8601_DATE_FORMAT),
    time: value - +(startOfDay(asDate)),
  }
}

export const combineDatetimeValues = (
  date: DateInputValue,
  time: TimeInputValue,
  fallback: boolean,
  defaultDate?: DateValue,
  defaultTime?: number
): DatetimeInputValue => {
  if (date === null && time === null) return null
  if (typeof date === 'undefined' && typeof time === 'undefined') return undefined

  const dateValid = typeof date === 'string'
  const timeValid = typeof time === 'number'
  if (!timeValid && !dateValid) {
    if (fallback) return null
    return undefined
  }
  // if (!(timeValid && dateValid) && !fallback) {
  //   return undefined
  // }
  const parsedDefaultDate = defaultDate ? startOfDay(parse(defaultDate, ISO_8601_DATE_FORMAT, new Date())) : startOfDay(new Date())
  const parsedDate = date ? startOfDay(parse(date, ISO_8601_DATE_FORMAT, new Date())) : parsedDefaultDate
  return +parsedDate + (time || (defaultTime || 0))
}
