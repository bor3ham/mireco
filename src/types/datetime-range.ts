import { isEmpty } from './empty'
import type { Empty } from './empty'
import { isDatetimeValue } from './datetime'
import type { DatetimeValue } from './datetime'

export interface DatetimeRangeValue {
  start: DatetimeValue
  end: DatetimeValue
}

export type DatetimeRangeInputValue = DatetimeRangeValue | Empty

export function isDatetimeRangeValue(value: DatetimeRangeInputValue): boolean {
  return (
    !isEmpty(value) &&
    isDatetimeValue(value!.start) &&
    isDatetimeValue(value!.end)
  )
}
