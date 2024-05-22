import type { InputValue } from './empty'

export type NumberInputValue = InputValue<number>

export function formatNumber(value: NumberInputValue): string {
  if (typeof value === 'number') {
    return `${value}`
  }
  return ''
}

export function parseNumber(textValue: string, min?: number, max?: number, step?: number): NumberInputValue {
  const trimmed = textValue.trim()
  if (trimmed.length === 0) {
    return null
  }
  const parsed = parseFloat(trimmed)
  if (Number.isNaN(parsed)) {
    return undefined
  }
  if (typeof step === 'number') {
    if (parsed % step !== 0) {
      return undefined
    }
  }
  if (typeof min === 'number' && parsed < min) {
    return undefined
  }
  if (typeof max === 'number' && parsed > max) {
    return undefined
  }
  return parsed
}
