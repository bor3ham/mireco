import React, { useReducer, useMemo, useEffect, useRef, useCallback } from 'react'
import classNames from 'classnames'

import { WidgetBlock, type WidgetBlockRef, type TimeTextRef, TimeText, TimeSelector } from 'components'
import Clock from '../vectors/clock.svg'
import type { TimeInputValue, TimeValue, TimeFormatFunction, TimeParseFunction } from 'types'
import { useInputKeyDownHandler, useLabelHover } from 'hooks'
import type { MirecoInputProps } from 'types/mireco'

// todo: don't include hidden input without name
// todo: add inputId prop or similar pattern

const DAY_MS = 24 * 60 * 60 * 1000

type TimeState = {
  dropdownOpen: boolean
  inFocus: boolean
}

type TimeAction =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'blur' }

function timeReducer(state: TimeState, action: TimeAction): TimeState {
  switch (action.type) {
    case 'open': {
      return {
        ...state,
        dropdownOpen: true,
        inFocus: true,
      }
    }
    case 'close': {
      return {
        ...state,
        dropdownOpen: false,
      }
    }
    case 'blur': {
      return {
        ...state,
        dropdownOpen: false,
        inFocus: false,
      }
    }
    default: {
      return state
    }
  }
}

export type TimeRef = {
  focus(): void
  element: HTMLInputElement | null
}

export type TimeProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'value' | 'onChange' | 'onBlur'> & {
  ref?: React.Ref<TimeRef>
  value?: TimeInputValue
  onChange?(newValue: TimeInputValue, wasBlur: boolean, event?: React.ChangeEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLInputElement>): void
  locale?: string
  format?: TimeFormatFunction
  parse?: TimeParseFunction
  simplify?: boolean
  icon?: React.ReactNode
  autoErase?: boolean
  /** Adjustment when using keyboard up/down, in ms */
  step?: number
  /** Starting point when using keyboard up/down with no value */
  startingPoint?: number
  /** Whether to hang the dropdown controls from the right */
  rightHang?: boolean
  /** Whether to show a clear X button inside the input */
  clearable?: boolean
  /** Whether to close the dropdown controls when a value is selected */
  closeOnSelect?: boolean
} & MirecoInputProps

export const Time = ({
  block,
  marginless,
  ref,
  value,
  onChange,
  onFocus,
  locale,
  format,
  parse,
  simplify = false,
  icon = <Clock className="MIRECO-clock" />,
  autoErase = true,
  step = 5 * 60 * 1000,
  startingPoint = 9 * 60 * 60 * 1000,
  rightHang,
  clearable = true,
  closeOnSelect = true,
  // extract some input props to be on parent instead
  id,
  name,
  className,
  style,
  // rest passed through
  ...vanillaProps
}: TimeProps) => {
  const [state, dispatch] = useReducer(timeReducer, {
    dropdownOpen: false,
    inFocus: false,
  })

  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    dispatch({ type: 'blur' })
    if (onChange) {
      onChange(typeof value === 'number' ? value : null, true)
    }
    if (vanillaProps.onBlur) {
      vanillaProps.onBlur(event)
    }
  }, [
    value,
    onChange,
    vanillaProps.onBlur,
  ])

  // respond to disabled change
  useEffect(() => {
    if (vanillaProps.disabled) {
      handleBlur()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vanillaProps.disabled,
  ])

  const handleTextChange = useCallback((newValue: TimeInputValue) => {
    if (onChange) {
      onChange(newValue, false)
    }
  }, [onChange])
  const handleTextTextChange = useCallback(() => {
    dispatch({ type: 'open' })
  }, [])
  const handleTextFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    dispatch({ type: 'open' })
    if (onFocus) {
      onFocus(event)
    }
  }, [onFocus])

  const containerRef = useRef<WidgetBlockRef>(null)
  const handleContainerBlur = useCallback((event: React.FocusEvent) => {
    if (
      containerRef.current &&
      containerRef.current.element && (
        containerRef.current.element.contains(event.relatedTarget) ||
        containerRef.current.element === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    handleBlur()
  }, [handleBlur])
  const focus = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  const handleContainerClick = useCallback(() => {
    focus()
  }, [focus])

  const closeDropdown = useCallback(() => {
    dispatch({ type: 'close' })
  }, [])
  const clean = useCallback(() => {
    if (textRef.current) {
      textRef.current.cleanText()
    }
    closeDropdown()
  }, [closeDropdown])
  const recordFocus = useCallback(() => {
    dispatch({ type: 'open' })
  }, [])
  const [fallback, has] = useMemo(() => {
    let has = false
    let fallback = startingPoint
    if (typeof value === 'number') {
      has = true
      fallback = value
    }
    return [fallback, has]
  }, [startingPoint, value])
  const decrement = useCallback(() => {
    let lowered = Math.floor(fallback / step) * step
    if (lowered === fallback && has) {
      lowered -= step
    }
    if (lowered < 0) {
      lowered += DAY_MS
    }
    if (onChange) {
      onChange(lowered, false)
    }
  }, [fallback, step, has, onChange])
  const increment = useCallback(() => {
    let raised = Math.ceil(fallback / step) * step
    if (raised === fallback && has) {
      raised += step
    }
    raised = raised % DAY_MS
    if (onChange) {
      onChange(raised, false)
    }
  }, [fallback, step, has, onChange])
  const handleTextKeyDown = useInputKeyDownHandler(
    state.dropdownOpen,
    closeDropdown,
    clean,
    recordFocus,
    decrement,
    increment,
  )

  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    dispatch({ type: 'open' })
    if (vanillaProps.onClick) {
      vanillaProps.onClick(event)
    }
  }, [vanillaProps.onClick])
  const textRef = useRef<TimeTextRef>(null)
  const handleSelect = useCallback((newValue: TimeValue, final: boolean) => {
    if (onChange) {
      onChange(newValue, false)
    }
    focus()
    if (closeOnSelect && final) {
      dispatch({ type: 'close' })
    }
  }, [onChange, focus, closeOnSelect])
  const handleClear = useCallback(() => {
    if (vanillaProps.disabled) {
      return
    }
    if (onChange) {
      onChange(null, false)
      focus()
    }
  }, [
    vanillaProps.disabled,
    onChange,
    focus,
  ])
  const canClear = (
    typeof value === 'number' &&
    clearable &&
    !vanillaProps.disabled
  )

  const formValue = useMemo<string>(() => {
    if (typeof value === 'number') {
      return `${value}`
    }
    return ''
  }, [value])

  const hovered = useLabelHover(id, focus)

  return (
    <WidgetBlock
      ref={containerRef}
      id={id}
      block={block}
      marginless={marginless}
      className={classNames(className, 'MIRECO-time', { 'MIRECO-hover': hovered })}
      style={style}
      inFocus={state.inFocus}
      icon={icon}
      clearable={canClear}
      disabled={vanillaProps.disabled}
      onClear={handleClear}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      onKeyDown={handleTextKeyDown}
    >
      <TimeText
        ref={textRef}
        {...vanillaProps}
        block
        value={value}
        onChange={handleTextChange}
        onTextChange={handleTextTextChange}
        onFocus={handleTextFocus}
        onClick={handleTextClick}
        locale={locale}
        format={format}
        parse={parse}
        simplify={simplify}
        autoErase={autoErase}
        className={classNames('MIRECO-embedded')} // textClassName
      />
      <input type="hidden" name={name} value={formValue} />
      {state.inFocus && state.dropdownOpen && !vanillaProps.disabled && (
        <TimeSelector
          className={classNames({
            'MIRECO-right-hang': rightHang,
          })}
          value={value}
          onChange={handleSelect}
        />
      )}
    </WidgetBlock>
  )
}
