import { isEmpty, type InputValue } from './empty'

export type TimeValue = number // ms since start of day

export type TimeInputValue = InputValue<TimeValue>

export function isTimeValue(value: TimeInputValue): boolean {
  return !isEmpty(value && !Number.isNaN(value))
}

export type TimeParseFunction = (value: string, locale?: string) => TimeInputValue

export type TimeFormatFunction = (value: TimeInputValue, locale?: string, simplify?: boolean) => string
