import { format, parse, isValid } from 'date-fns'

import { isEmpty, type InputValue } from './empty'

export type CalendarMonthValue = number // 0-11

export type CalendarMonthInputValue = InputValue<CalendarMonthValue>

export function isCalendarMonthValue(value: CalendarMonthInputValue): boolean {
  if (isEmpty(value)) {
    return false
  }
  return value! >= 0 && value! <= 11
}

export function formatCalendarMonth(value: CalendarMonthInputValue, displayFormat: string): string {
  if (!isCalendarMonthValue(value)) {
    return ''
  }
  const now = new Date()
  const asDate = new Date(now.getFullYear(), value!)
  return format(asDate, displayFormat)
}

export function parseCalendarMonth(textValue: string, inputFormats: string[]): CalendarMonthInputValue {
  const cleaned = textValue.trim().toLowerCase()
  if (cleaned.length <= 0) {
    return null
  }

  const asNumber = parseInt(cleaned)
  if (!Number.isNaN(asNumber) && asNumber > 12) {
    return undefined
  }

  let valid: CalendarMonthInputValue
  
  // hard code some expected auto completes
  if (cleaned === 'ju') {
    valid = 5
  } else if (cleaned === 'au') {
    valid = 7
  }

  const findValidInput = (input: string) => {
    inputFormats.forEach((inputFormat) => {
      if (typeof valid !== 'undefined') {
        return
      }
      const parsed = parse(input, inputFormat, new Date())
      if (isValid(parsed)) {
        valid = parsed.getMonth()
      }
    })
  }
  findValidInput(cleaned)
  if (!isCalendarMonthValue(valid)) {
    const truncThree = cleaned.substring(0, 3)
    findValidInput(truncThree)
  }
  if (!isCalendarMonthValue(valid)) {
    const truncOne = cleaned.substring(0, 1)
    findValidInput(truncOne)
  }
  return valid
}
