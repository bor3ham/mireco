import type { Empty } from './empty'
import { isEmpty } from './empty'

export type DatetimeValue = number // epoch ms eg: 1686116893002

export type DatetimeInputValue = DatetimeValue | Empty

export function isDatetimeValue(value: DatetimeInputValue): boolean {
  return !isEmpty(value) && !isNaN(value!)
}
