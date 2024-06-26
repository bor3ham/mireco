import humanizeDuration from 'humanize-duration'
import parse from 'parse-duration'
import type { Unit } from 'humanize-duration'

import type { InputValue } from './empty'

// simplify large units rather than exact
parse.month = parse.week * 4
parse.year = parse.week * 52

export type DurationValue = number // ms

export type DurationInputValue = InputValue<DurationValue>

export function formatDuration(value: DurationInputValue, humaniseUnits: Unit[]): string {
  let formatted = ''
  if (typeof value === 'number') {
    formatted = humanizeDuration(value, {
      units: humaniseUnits,
    })
  }
  return formatted
}

export function parseDuration(value: string, defaultTimeUnit: string): DurationInputValue {
  let trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }
  if (trimmed.replace(/[^\d.,-]/g, '') === trimmed) {
    trimmed += ` ${defaultTimeUnit}`
  }

  const parsed = parse(trimmed)
  if (parsed === null || typeof parsed === 'undefined') {
    return undefined
  }
  return Math.floor(parsed)
}
