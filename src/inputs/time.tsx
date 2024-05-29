import React, { useReducer, useMemo, useEffect, useRef, useCallback, forwardRef } from 'react'
import classNames from 'classnames'

import { WidgetBlock, type TimeTextHandle, TimeText, TimeSelector } from 'components'
import { ClockVector } from 'vectors'
import type { TimeInputValue, TimeValue, TimeFormatFunction, TimeParseFunction } from 'types'
import { useInputKeyDownHandler } from 'hooks'

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

export interface TimeProps {
  // === Mireco
  block?: boolean

  // === Time Input Specific
  value?: TimeInputValue
  onChange?(newValue: TimeInputValue, wasBlur: boolean): void
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

  // === Text Input
  placeholder?: string
  textClassName?: string
  size?: number
  autoComplete?: string

  // === Form
  name?: string
  required?: boolean
  disabled?: boolean

  // === HTML
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string

  // === Event Handlers
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLInputElement>): void
  onClick?(event: React.MouseEvent<HTMLInputElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLInputElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLInputElement>): void
}

export const Time = forwardRef<HTMLInputElement, TimeProps>(({
  block,
  value,
  onChange,
  locale,
  format,
  parse,
  simplify = false,
  icon = <ClockVector />,
  autoErase = true,
  step = 15 * 60 * 1000,
  startingPoint = 9 * 60 * 60 * 1000,
  rightHang,
  clearable = true,
  closeOnSelect = true,
  placeholder,
  textClassName,
  size,
  autoComplete,
  name,
  required,
  disabled,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  onFocus,
  onBlur,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onKeyDown,
  onKeyUp,
}, forwardedRef) => {
  const [state, dispatch] = useReducer(timeReducer, {
    dropdownOpen: false,
    inFocus: false,
  })

  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    dispatch({ type: 'close' })
    if (onChange) {
      onChange(typeof value === 'number' ? value : null, true)
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    value,
    onChange,
    onBlur,
  ])

  // respond to disabled change
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disabled,
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

  const containerRef = useRef<HTMLDivElement>(null)
  const handleContainerBlur = useCallback((event: React.FocusEvent) => {
    if (
      containerRef.current
      && (
        containerRef.current.contains(event.relatedTarget) ||
        containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    handleBlur()
  }, [handleBlur])
  const handleContainerClick = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  
  const closeDropdown = useCallback(() => {
    dispatch({ type: 'close' })
  }, [])
  const clean = useCallback(() => {
    if (textRef.current) {
      textRef.current.cleanText()
    }
  }, [])
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
    if (onClick) {
      onClick(event)
    }
  }, [onClick])
  const textRef = useRef<TimeTextHandle>(null)
  const handleSelect = useCallback((newValue: TimeValue, final: boolean) => {
    if (onChange) {
      onChange(newValue, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    if (closeOnSelect && final) {
      dispatch({ type: 'close' })
    }
  }, [onChange, closeOnSelect])
  const handleClear = useCallback(() => {
    if (disabled) {
      return
    }
    if (onChange) {
      onChange(null, false)
      if (textRef.current) {
        textRef.current.focus()
      }
    }
  }, [
    disabled,
    onChange,
  ])
  const canClear = (
    typeof value === 'number' &&
    clearable &&
    !disabled
  )

  const formValue = useMemo<string>(() => {
    if (typeof value === 'number') {
      return `${value}`
    }
    return ''
  }, [value])

  const timeSelected = useCallback((time: TimeValue, rounding: number) => {
    if (!value) return false
    return value === time
  }, [value])

  return (
    <WidgetBlock
      ref={containerRef}
      block={block}
      style={style}
      className={classNames(className, 'MIRECO-time')}
      inFocus={state.inFocus}
      icon={icon}
      clearable={canClear}
      everClearable={clearable}
      disabled={disabled}
      id={id}
      onClear={handleClear}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={handleTextKeyDown}
      onKeyUp={onKeyUp}
    >
      <TimeText
        ref={textRef}
        value={value}
        onChange={handleTextChange}
        onTextChange={handleTextTextChange}
        locale={locale}
        format={format}
        parse={parse}
        simplify={simplify}
        autoErase={autoErase}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={classNames('MIRECO-embedded', textClassName)}
        title={title}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        size={size}
        onFocus={handleTextFocus}
        onClick={handleTextClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        onKeyUp={onKeyUp}
      />
      <input type="hidden" name={name} value={formValue} />
      {state.inFocus && state.dropdownOpen && !disabled && (
        <TimeSelector
          className={classNames({
            'right-hang': rightHang,
          })}
          value={value}
          onChange={handleSelect}
          minuteIncrements={15}
          selected={timeSelected}
        />
      )}
    </WidgetBlock>
  )
})
