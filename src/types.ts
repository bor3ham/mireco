export type Empty = null | undefined

export type Date = string

export type DateValue = Date | Empty

export type Duration = number

export type DurationValue = Duration | Empty

export type NumberValue = number | Empty

export type Range = number

export type RangeValue = Range | null

export type Select = string | number | boolean

export type SelectValue = Select | Empty

export interface SelectOption {
  value: Select
  label: string
}

export type SelectOptionValue = SelectOption | Empty

export type Time = number

export type TimeValue = Time | Empty

export type Datetime = number

export type DatetimeValue = Datetime | Empty
