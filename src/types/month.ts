import { format, parse, isValid, addMonths, subMonths } from 'date-fns'

import { ISO_8601_MONTH_FORMAT } from 'constants'
import { isEmpty } from './empty'
import type { Empty } from './empty'
import { CalendarMonthInputValue, isCalendarMonthValue, parseCalendarMonth } from './calendar-month'

export type MonthValue = string // ISO8601 formatted month eg: '2023-02'

export type MonthInputValue = MonthValue | Empty

export function isMonthValue(value: MonthInputValue): boolean {
  if (isEmpty(value)) {
    return false
  }
  const asDate = parse(value!, ISO_8601_MONTH_FORMAT, new Date())
  if (!isValid(asDate)) {
    return false
  }
  return true
}

export function formatMonth(value: MonthInputValue, displayFormat: string): string {
  if (isEmpty(value)) {
    return ''
  }
  const asDate = parse(value!, ISO_8601_MONTH_FORMAT, new Date())
  if (!isValid(asDate)) {
    return ''
  }
  return format(asDate, displayFormat)
}

const trailingYear = /(\d+)$/

export function dateAsMonth(date: Date): MonthInputValue {
  if (!isValid(date)) {
    return undefined
  }
  return format(date, ISO_8601_MONTH_FORMAT)
}

export function monthAsDate(month: MonthValue): Date {
  return parse(month, ISO_8601_MONTH_FORMAT, new Date())
}

export function prevMonth(month: MonthValue): MonthValue {
  const asDate = monthAsDate(month)
  return dateAsMonth(subMonths(asDate, 1))!
}

export function nextMonth(month: MonthValue): MonthValue {
  const asDate = monthAsDate(month)
  return dateAsMonth(addMonths(asDate, 1))!
}

export function calendarMonthInYear(calendarMonth: CalendarMonthInputValue, year?: number): MonthInputValue {
  let useYear: number | undefined = year
  if (typeof year === 'undefined') {
    const now = new Date()
    useYear = now.getFullYear()
  }
  if (isCalendarMonthValue(calendarMonth)) {
    const asDate = new Date(useYear!, calendarMonth!)
    return dateAsMonth(asDate)
  }
  return calendarMonth as Empty
}

export function parseMonth(textValue: string, yearInputFormats: string[], monthInputFormats: string[]): MonthInputValue {
  const cleaned = textValue.trim().toLowerCase()
  if (cleaned.length <= 0) {
    return null
  }
  const yearString = textValue.match(trailingYear)
  if (yearString) {
    let yearDate: Date | undefined
    yearInputFormats.forEach((inputFormat) => {
      if (typeof yearDate !== 'undefined') {
        return
      }
      const parsed = parse(yearString[1], inputFormat, new Date())
      if (isValid(parsed)) {
        yearDate = parsed
      }
    })
    if (typeof yearDate === 'undefined') {
      return undefined
    }
    
    const year = yearDate.getFullYear()
    let beforeString = textValue.replace(trailingYear, '').trim()
    beforeString = beforeString.replace(/\\/g, '/') // replace backslashes with forward
    beforeString = beforeString.replace(/ /g, '/') // replace spaces with slashes
    beforeString = beforeString.replace(/\/+/g, '/') // merge several slashes into one
    beforeString = beforeString.replace(/\/+$/, '') // remove trailing slashes from consideration
    if (beforeString.length > 0) {
      const asMonth = parseCalendarMonth(beforeString, monthInputFormats)
      return calendarMonthInYear(asMonth, year)
    }
    return calendarMonthInYear(0, year)
  }
  const asMonth = parseCalendarMonth(textValue, monthInputFormats)
  return calendarMonthInYear(asMonth)
}
