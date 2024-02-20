import React, { useReducer, useMemo, useEffect, useRef, useCallback, forwardRef } from 'react'
import humanizeDuration from 'humanize-duration'
import classNames from 'classnames'

import { WidgetTimeText, type TimeTextHandle, BlockDiv, TimeSelector } from 'components'
import { ClockVector } from 'vectors'
import type { TimeInputValue, TimeValue } from 'types'
import { formatTime } from 'types'

const DAY_MS = 24 * 60 * 60 * 1000

type TimeState = {
  text: string
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

const shortHumanizeDur = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      h: () => 'h',
      m: () => 'm',
    },
  },
})

export interface TimeProps {
  // === Mireco
  block?: boolean

  // === Time Input Specific
  value?: TimeInputValue
  onChange?(newValue: TimeInputValue, wasBlur: boolean): void
  inputFormats?: string[]
  longFormat?: string
  displayFormat?: string
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
  inputFormats = [
    'h:mm:ss a',
    'h:mm:ssa',
    'h:mm:ss',
    'h:mm a',
    'H:mm:ss',
    'H:mm',
    'h:mma',
    'h:mm',
    'h a',
    'H:mm',
    'H',
    'ha',
    'h',
  ],
  longFormat = 'h:mm:ss a',
  displayFormat = 'h:mm a',
  simplify = false,
  icon = <ClockVector />,
  autoErase = true,
  step = 15 * 60 * 1000,
  startingPoint = 9 * 60 * 60 * 1000,
  rightHang,
  clearable = true,
  closeOnSelect = true,
  placeholder = 'hh : mm',
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
  const formattedValue = useMemo(() => formatTime(value, inputFormats, longFormat, displayFormat, simplify), [
    value,
    inputFormats,
    longFormat,
    displayFormat,
    simplify,
  ])
  const [state, dispatch] = useReducer(timeReducer, {
    text: formattedValue,
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
  
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (state.dropdownOpen) {
        const formatted = formatTime(value, inputFormats, longFormat, displayFormat, simplify)
        if (textRef.current) {
          textRef.current.setText(formatted)
        }
        dispatch({ type: 'close' })
        event.preventDefault()
      }
      return
    }
    dispatch({ type: 'open' })
    let wasEmpty = true
    let current = startingPoint
    if (typeof value === 'number') {
      wasEmpty = false
      current = value
    }
    if (event.key === 'ArrowUp') {
      let loweredCurrent = Math.floor(current / step) * step
      if (loweredCurrent === current && !wasEmpty) {
        loweredCurrent -= step
      }
      if (loweredCurrent < 0) {
        loweredCurrent += DAY_MS
      }
      event.preventDefault()
      if (onChange) {
        onChange(loweredCurrent, false)
      }
    } else if (event.key === 'ArrowDown') {
      let raisedCurrent = Math.ceil(current / step) * step
      if (raisedCurrent === current && !wasEmpty) {
        raisedCurrent += step
      }
      raisedCurrent = raisedCurrent % DAY_MS
      event.preventDefault()
      if (onChange) {
        onChange(raisedCurrent, false)
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [state.dropdownOpen, startingPoint, value, displayFormat, onChange, onKeyDown])
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

  return (
    <BlockDiv
      ref={containerRef}
      className={classNames(
        'MIRECO-time',
        {
          'right-hang': rightHang,
        },
        className,
      )}
      tabIndex={-1}
      onBlur={handleContainerBlur}
      block={block}
      style={style}
    >
      <WidgetTimeText
        block={block}
        value={value}
        onChange={handleTextChange}
        onTextChange={handleTextTextChange}
        displayFormat={displayFormat}
        inputFormats={inputFormats}
        autoErase={autoErase}
        icon={icon}
        onClear={canClear ? handleClear : undefined}
        everClearable={clearable}
        id={id}
        ref={textRef}
        placeholder={placeholder}
        disabled={disabled}
        style={{marginBottom: '0'}}
        required={required}
        autoComplete={autoComplete}
        className={textClassName}
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
        onKeyDown={handleTextKeyDown}
        onKeyUp={onKeyUp}
      />
      <input type="hidden" name={name} value={formValue} />
      {state.inFocus && state.dropdownOpen && !disabled && (
        <TimeSelector
          value={value}
          onChange={handleSelect}
          minuteIncrements={15}
        />
      )}
    </BlockDiv>
  )
})
