import type { Empty } from './empty'
import { isEmpty } from './empty'

export type TimeValue = number

export type TimeInputValue = TimeValue | Empty

export function isTimeValue(value: TimeInputValue): boolean {
  return !isEmpty(value && !Number.isNaN(value))
}

export type TimeParseFunction = (value: string, locale?: string) => TimeInputValue

export type TimeFormatFunction = (value: TimeInputValue, locale?: string, simplify?: boolean) => string
