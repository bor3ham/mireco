import { isEmpty } from './empty'
import type { Empty } from './empty'
import { isDatetimeValue } from './datetime'
import type { DatetimeValue, DatetimeInputValue } from './datetime'

export interface DatetimeRangeValue {
  start: DatetimeValue
  end: DatetimeValue
}

interface DatetimeRangeInput {
  start: DatetimeInputValue
  end: DatetimeInputValue
}

export type DatetimeRangeInputValue = DatetimeRangeInput | Empty

export function isDatetimeRangeValue(value: DatetimeRangeInputValue): boolean {
  return (
    !isEmpty(value) &&
    isDatetimeValue(value!.start) &&
    isDatetimeValue(value!.end)
  )
}
