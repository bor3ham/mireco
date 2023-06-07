import React, { useReducer, useMemo, useEffect, useRef, useCallback } from 'react'
import humanizeDuration from 'humanize-duration'
import classNames from 'classnames'
import { format, addMilliseconds, startOfDay, isValid, parse } from 'date-fns'

import { WidgetText, BlockDiv, Dropdown } from 'components'
import { ClockVector } from 'vectors'
import { KEYBOARD_ARROW_DOWN, KEYBOARD_ARROW_UP, KEYBOARD_ENTER, KEYBOARD_ESCAPE } from 'constants'
import type { TimeValue, DatetimeValue } from 'types'

function nonEmptyValue(value: TimeValue) {
  return typeof value === 'number' && !isNaN(value)
}

function formatValue(value: TimeValue, inputFormats: string[], longFormat: string, displayFormat: string): string {
  if (!nonEmptyValue(value)) {
    return ''
  }
  let adjustedValue = value as number
  adjustedValue = +addMilliseconds(startOfDay(new Date()), adjustedValue)
  let longFormatted = format(adjustedValue, longFormat)
  let displayFormatted = format(adjustedValue, displayFormat)
  let longParsed = parseValue(longFormatted, inputFormats)
  let shortParsed = parseValue(displayFormatted, inputFormats)
  if (longParsed === shortParsed) {
    return displayFormatted
  }
  else {
    return longFormatted
  }
}

function parseValue(textValue: string, inputFormats: string[]): TimeValue {
  let trimmed = textValue.trim()
  // todo: remove superfluous spaces
  if (trimmed.length === 0) {
    return null
  }
  let valid: TimeValue = undefined
  inputFormats.map((format) => {
    if (nonEmptyValue(valid)) {
      return
    }
    let parsed = parse(trimmed, format, startOfDay(new Date()))
    if (isValid(parsed)) {
      valid = +parsed
      valid -= +startOfDay(new Date())
    }
  })
  return valid
}

type TimeState = {
  text: string
  dropdownOpen: boolean
  inFocus: boolean
}

type TimeAction =
  | { type: 'open' }
  | { type: 'textInput', text: string }
  | { type: 'close', formatted?: string, blur?: boolean }
  | { type: 'textOverride', text: string }

function timeReducer(state: TimeState, action: TimeAction): TimeState {
  switch (action.type) {
    case 'open': {
      return {
        ...state,
        dropdownOpen: true,
        inFocus: true,
      }
    }
    case 'textInput': {
      return {
        ...state,
        text: action.text,
        dropdownOpen: true,
        inFocus: true,
      }
    }
    case 'close': {
      const updated = {
        ...state,
        dropdownOpen: false,
      }
      if ('formatted' in action) {
        updated.text = action.formatted || ''
      }
      if ('blur' in action) {
        updated.inFocus = false
      }
      return updated
    }
    case 'textOverride': {
      return {
        ...state,
        text: action.text,
      }
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
  // mireco
  block?: boolean
  // time
  value?: TimeValue
  onChange?(newValue: TimeValue, wasBlur: boolean): void
  inputFormats?: string[]
  longFormat?: string
  displayFormat?: string
  placeholder?: string
  autoErase?: boolean
  step?: number
  relativeTo?: DatetimeValue
  relativeStart?: TimeValue
  rightHang?: boolean
  clearable?: boolean
  textClassName?: string
  size?: number
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string
  // form
  name?: string
  required?: boolean
  disabled?: boolean
  // event handlers
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

export const Time: React.FC<TimeProps> = ({
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
  placeholder = 'hh : mm',
  autoErase = true,
  step = 30,
  relativeTo,
  relativeStart = 0,
  rightHang,
  clearable = true,
  textClassName,
  size,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  name,
  required,
  disabled,
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
}) => {
  const formattedValue = useMemo(() => {
    return formatValue(value, inputFormats, longFormat, displayFormat)
  }, [
    value,
    inputFormats,
    longFormat,
    displayFormat,
  ])
  const [state, dispatchState] = useReducer(timeReducer, {
    text: formattedValue,
    dropdownOpen: false,
    inFocus: false,
  })

  const options = useMemo(() => {
    const o = []
    for (var min = 0; min < 24 * 60; min += step) {
      let ms = min * 60 * 1000
      let newOption = {
        value: ms,
        label: format(addMilliseconds(startOfDay(new Date()), ms), displayFormat),
      }
      if (typeof relativeTo === 'number' && typeof relativeStart === 'number') {
        let msAbsolute = relativeStart + newOption.value
        if (msAbsolute > relativeTo) {
          let duration = msAbsolute - relativeTo
          if (
            duration <= (24 * 60 * 60 * 1000) &&
            duration % (5 * 60 * 1000) === 0
          ) {
            newOption.label += ` (${shortHumanizeDur(duration, {
              units: ['h', 'm'],
              spacer: '',
            })})`
          }
        }
      }
      o.push(newOption)
    }
    return o
  }, [
    step,
    displayFormat,
    relativeTo,
    relativeStart,
  ])

  useEffect(() => {
    if (value === null) {
      dispatchState({
        type: 'textOverride',
        text: '',
      })
    } else if (nonEmptyValue(value)) {
      if (value !== parseValue(state.text, inputFormats)) {
        dispatchState({
          type: 'textOverride',
          text: formattedValue,
        })
      }
    }
  }, [
    value,
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (nonEmptyValue(value)) {
      dispatchState({
        type: 'close',
        formatted: formattedValue,
        blur: true,
      })
      if (onChange) { 
        onChange(value, true)
      }
    } else {
      if (autoErase) {
        dispatchState({
          type: 'close',
          formatted: '',
          blur: true,
        })
        if (onChange) { 
          onChange(null, true)
        }
      } else {
        dispatchState({
          type: 'close',
          blur: true,
        })
        if (onChange) { 
          onChange(value, true)
        }
      }
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    value,
    formattedValue,
    autoErase,
    onChange,
    onBlur,
  ])
  useEffect(() => {
    if (disabled && state.inFocus) {
      handleBlur()
    }
  }, [
    state.inFocus,
    disabled,
    handleBlur,
  ])
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    dispatchState({
      type: 'open',
    })
    if (onFocus) {
      onFocus(event)
    }
  }, [
    onFocus,
  ])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (
      containerRef.current &&
      (
        containerRef.current.contains(event.relatedTarget) ||
        containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    handleBlur(event)
  }, [
    handleBlur,
  ])

  const handleTextChange = useCallback((newValue: string) => {
    dispatchState({
      type: 'textInput',
      text: newValue,
    })
    if (onChange) {
      onChange(parseValue(newValue, inputFormats), false)
    }
  }, [
    onChange,
    inputFormats,
  ])
  const nextOption = useMemo(() => {
    if (!nonEmptyValue(value)) {
      return options[0].value
    }
    let nextIndex = 0
    options.map((option, index) => {
      if (option.value <= value!) {
        nextIndex = index
      }
    })
    nextIndex += 1
    if (nextIndex >= options.length) {
      nextIndex = 0
    }
    return options[nextIndex].value
  }, [
    value,
    options,
  ])
  const prevOption = useMemo(() => {
    if (!nonEmptyValue(value)) {
      return nextOption
    }
    if (value === options[0].value) {
      return options[options.length - 1].value
    }
    let nextIndex = 0
    options.map((option, index) => {
      if (option.value < value!) {
        nextIndex = index
      }
    })
    return options[nextIndex].value
  }, [
    value,
    options,
    nextOption,
  ])
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && (event.which === KEYBOARD_ENTER || event.which === KEYBOARD_ESCAPE)) {
      if (state.dropdownOpen) {
        dispatchState({
          type: 'close',
          formatted: formattedValue,
        })
        event.preventDefault()
      }
      return
    }
    if (event.which === KEYBOARD_ARROW_DOWN) {
      event.preventDefault()
      if (onChange) {
        onChange(nextOption, false)
      }
      dispatchState({
        type: 'open',
      })
    }
    if (event.which === KEYBOARD_ARROW_UP) {
      event.preventDefault()
      if (onChange) {
        onChange(prevOption, false)
      }
      dispatchState({
        type: 'open',
      })
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [
    formattedValue,
    nextOption,
    prevOption,
    onKeyDown,
  ])
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    dispatchState({
      type: 'open',
    })
    if (onClick) {
      onClick(event)
    }
  }, [
    onClick,
  ])
  const textRef = useRef<HTMLInputElement>(null)
  const handleDropdownSelect = useCallback((newValue: number) => {
    if (onChange) {
      onChange(newValue, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    dispatchState({
      type: 'close',
      formatted: formatValue(newValue, inputFormats, longFormat, displayFormat),
    })
  }, [
    onChange,
    inputFormats,
    longFormat,
    displayFormat,
  ])
  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
      if (textRef.current) {
        textRef.current.focus()
      }
    }
  }, [])
  const showClear = (
    !disabled && nonEmptyValue(value) && clearable
  )
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
      <WidgetText
        ref={textRef}
        placeholder={placeholder}
        onChange={handleTextChange}
        value={state.text}
        onFocus={handleFocus}
        disabled={disabled}
        onKeyDown={handleTextKeyDown}
        block={block}
        style={{marginBottom: '0'}}
        onClick={handleTextClick}
        icon={<ClockVector />}
        everClearable={clearable}
        onClear={!showClear ? undefined : handleClear}
        className={textClassName}
        id={id}
        autoFocus={autoFocus}
        name={name}
        tabIndex={tabIndex}
        title={title}
        required={required}
        size={size}
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
      {state.inFocus && state.dropdownOpen && !disabled && (
        <Dropdown
          options={options}
          value={value}
          disabled={disabled}
          onSelect={handleDropdownSelect}
        />
      )}
    </BlockDiv>
  )
}
