import React, { useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'

import type { NumberInputValue } from 'types'
import { formatNumber, parseNumber } from 'types'
import { Text, type TextRef } from './text'
import type { MirecoInputProps } from 'types/mireco'

export type NumberRef = {
  focus(): void
  element: HTMLInputElement | null
}

export type NumberProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'> & {
  ref?: React.Ref<NumberRef>
  value?: NumberInputValue
  onChange?(newValue: NumberInputValue, wasBlur: boolean, event?: React.ChangeEvent<HTMLInputElement>): void
  min?: number
  max?: number
  step?: number
} & MirecoInputProps

const NumberInput = ({
  block,
  ref,
  value,
  onChange,
  min,
  max,
  step,
  ...vanillaProps
}: NumberProps) => {
  const innerRef = useRef<TextRef>(null)
  const focus = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.focus()
    }
  }, [])
  useImperativeHandle(ref, () => ({
    focus,
    element: innerRef.current ? innerRef.current.element : null,
  }), [
    focus,
  ])

  const [textValue, setTextValue] = useState(formatNumber(value))
  useEffect(() => {
    if (
      typeof value !== 'undefined' &&
      parseNumber(textValue, min, max, step) !== value
    ) {
      setTextValue(formatNumber(value))
    }
  }, [value, textValue, min, max, step])
  const handleTextChange = useCallback((newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === 'function') {
      setTextValue(newValue)
      onChange(parseNumber(newValue, min, max, step), false, event)
    }
  }, [onChange, min, max, step])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (typeof onChange !== 'function') {
        return
      }
      const current = typeof value === 'number' ? value : 0
      const currentStep = typeof step === 'number' ? step : 1
      if (event.key === 'ArrowUp') {
        const next = current + currentStep
        if (typeof max !== 'number' || next <= max) {
          onChange(next, false)
        }
      }
      if (event.key === 'ArrowDown') {
        const next = current - currentStep
        if (typeof min !== 'number' || next >= min) {
          onChange(next, false)
        }
      }
    }
    if (typeof vanillaProps.onKeyDown === 'function') {
      vanillaProps.onKeyDown(event)
    }
  }, [
    onChange,
    value,
    step,
    max,
    min,
    vanillaProps.onKeyDown,
  ])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const stringified = formatNumber(value)
    setTextValue(stringified)
    if (typeof onChange === 'function') {
      onChange(value || null, true)
    }
    if (typeof vanillaProps.onBlur === 'function') {
      vanillaProps.onBlur(event)
    }
  }, [
    value,
    onChange,
    vanillaProps.onBlur,
  ])

  return (
    <Text
      ref={innerRef}
      {...vanillaProps}
      block={block}
      value={textValue}
      onChange={handleTextChange}
      className={classNames(
        'MIRECO-number',
        vanillaProps.className,
      )}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      // not actually "number" annoyingly because the browser doesn't acknowledge unclean values
      type="text"
    />
  )
}

export { NumberInput as Number }
