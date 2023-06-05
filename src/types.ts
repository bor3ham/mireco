export type DateValue = string | null | undefined

export type DurationValue = number | null | undefined

export type NumberValue = number | null | undefined

export type RangeValue = number | null

export type SelectValue = string | number | boolean | null | undefined

export interface SelectOption {
  value: SelectValue
  label: string
}
