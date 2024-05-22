import type { InputValue } from './empty'

export type SelectValue = string | number | boolean

export type SelectInputValue = InputValue<SelectValue>

export interface SelectOption {
  value: SelectValue
  label: string
}

export type SelectOptionInputValue = InputValue<SelectOption>
