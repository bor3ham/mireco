import { isEmpty } from './empty'
import { isDatetimeValue } from './datetime'
import { type DatetimeInputValue, splitDatetimeValue, combineDatetimeValues } from './datetime'
import type { DateInputValue, DateValue } from './date'
import type { TimeInputValue } from './time'

export interface DatetimeRangeValue {
  start: DatetimeInputValue
  end: DatetimeInputValue
}

export type DatetimeRangeInputValue = DatetimeRangeValue

export function isDatetimeRangeValue(value: DatetimeRangeInputValue): boolean {
  return (
    !isEmpty(value) &&
    isDatetimeValue(value!.start) &&
    isDatetimeValue(value!.end)
  )
}

export const splitDatetimeRangeValue = (value: DatetimeRangeInputValue): {
  startDate: DateInputValue
  startTime: TimeInputValue
  endDate: DateInputValue
  endTime: TimeInputValue
} => {
  if (typeof value === 'undefined') return {
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
  }
  if (value === null) return {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  }
  const start = splitDatetimeValue(value.start)
  const end = splitDatetimeValue(value.end)
  return {
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
  }
}

export const combineDatetimeRangeValues = (
  startDate: DateInputValue,
  startTime: TimeInputValue,
  endDate: DateInputValue,
  endTime: TimeInputValue,
  fallback: boolean,
  defaultDate?: DateValue,
  defaultTime?: number
): DatetimeRangeInputValue => {
  return {
    start: combineDatetimeValues(startDate, startTime, fallback, defaultDate, defaultTime),
    end: combineDatetimeValues(endDate, endTime, fallback, startDate || defaultDate, 0),
  }
}
