import type { Empty } from './empty'

export type SelectValue = string | number | boolean

export type SelectInputValue = SelectValue | Empty

export interface SelectOption {
  value: SelectValue
  label: string
}

export type SelectOptionInputValue = SelectOption | Empty
