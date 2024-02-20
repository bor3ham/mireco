import React, { useReducer, useCallback, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { parse, format, addDays, subDays, max } from 'date-fns'

import { type DateRangeInputValue, type DateInputValue, type DateValue, formatDate } from 'types'
import { WidgetBlock, ClearButton, DateText, type DateTextHandle, DayCalendar } from 'components'
import { ISO_8601_DATE_FORMAT } from 'constants'
import { CalendarVector } from 'vectors'

export interface DateRangeProps {
  // mireco
  block?: boolean
  // date range
  value?: DateRangeInputValue
  onChange?(newValue: DateRangeInputValue, wasBlur: boolean): void
  displayFormat?: string
  inputFormats?: string[]
  icon?: React.ReactNode
  clearable?: boolean
  size?: number

  // html
  id?: string
  autoFocus?: boolean
  style?: React.CSSProperties
  className?: string
  // form
  disabled?: boolean
  name?: string
  required?: boolean
}

const cleanedValue = (value: DateRangeInputValue): DateRangeInputValue => {
  if (!value.start || !value.end) return {
    start: value.start || null,
    end: value.end || null,
  }
  const parsedStart = parse(value.start, ISO_8601_DATE_FORMAT, new Date())
  const parsedEnd = parse(value.end, ISO_8601_DATE_FORMAT, new Date())
  if (parsedStart > parsedEnd) {
    return {
      start: value.end,
      end: value.start,
    }
  }
  return value
}

enum DateRangeInput {
  Start = 'start',
  End = 'end',
}

type DateRangeState = {
  start: DateInputValue
  end: DateInputValue
  inFocus: boolean
  focusInput: DateRangeInput
  calendarOpen: boolean
}

type DateRangeAction =
  | { type: 'updateStart', value: DateInputValue }
  | { type: 'updateEnd', value: DateInputValue }
  | { type: 'updateBoth', start: DateInputValue, end: DateInputValue }
  | { type: 'focus', focusInput: DateRangeInput }
  | { type: 'blur' }
  | { type: 'cleanedBlur', start: DateInputValue, end: DateInputValue }
  | { type: 'clear' }
  | { type: 'closeCalendar' }
  | { type: 'showCalendar' }

function dateRangeReducer(state: DateRangeState, action: DateRangeAction): DateRangeState {
  switch (action.type) {
    case 'updateStart': {
      return {
        ...state,
        start: action.value,
      }
    }
    case 'updateEnd': {
      return {
        ...state,
        end: action.value,
      }
    }
    case 'updateBoth': {
      return {
        ...state,
        start: action.start,
        end: action.end,
      }
    }
    case 'focus': {
      return {
        ...state,
        inFocus: true,
        focusInput: action.focusInput,
        calendarOpen: true,
      }
    }
    case 'blur': {
      return {
        ...state,
        inFocus: false,
        focusInput: DateRangeInput.Start,
        calendarOpen: false,
      }
    }
    case 'cleanedBlur': {
      return {
        ...state,
        inFocus: false,
        calendarOpen: false,
        start: action.start,
        end: action.end,
      }
    }
    case 'clear': {
      return {
        ...state,
        start: null,
        end: null,
      }
    }
    case 'closeCalendar': {
      return {
        ...state,
        calendarOpen: false,
      }
    }
    case 'showCalendar': {
      return {
        ...state,
        calendarOpen: true,
      }
    }
    default: {
      return state
    }
  }
}

export const DateRange: React.FC<DateRangeProps> = ({
  block,
  value,
  onChange,
  displayFormat = 'do MMM yyyy',
  inputFormats = [
    'd',
    'do',
    'd/MM',
    'do/MMM',
    'do/MMMM',
    'd/MM/yy',
    'd/MM/yyyy',
    'do/MMM/yy',
    'do/MMM/yyyy',
    'do/MMMM/yy',
    'do/MMMM/yyyy',
  ],
  icon = <CalendarVector />,
  clearable = true,
  size = 12,
  id,
  autoFocus,
  style,
  className,
  disabled,
  name,
  required,

}) => {
  const [state, dispatch] = useReducer(dateRangeReducer, {
    start: value ? value.start : null,
    end: value ? value.end : null,
    inFocus: false,
    focusInput: DateRangeInput.Start,
    calendarOpen: false,
  })

  useEffect(() => {
    if (value) {
      dispatch({
        type: 'updateBoth',
        start: value.start,
        end: value.end,
      })
    }
  }, [
    value,
  ])

  const handleStartChange = useCallback((newStart: DateInputValue) => {
    const newValue = {
      start: newStart,
      end: state.end,
    }
    if (onChange) {
      onChange(newValue, false)
    } else {
      dispatch({
        type: 'updateStart',
        value: newStart,
      })
    }
  }, [state, onChange])
  const handleEndChange = useCallback((newEnd: DateInputValue) => {
    const newValue = {
      start: state.start,
      end: newEnd,
    }
    if (onChange) {
      onChange(newValue, false)
    } else {
      dispatch({
        type: 'updateEnd',
        value: newEnd,
      })
    }
  }, [state, onChange])
  const handleStartKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (state.calendarOpen) {
        const formatted = formatDate(value ? value.start : null, displayFormat)
        if (startRef.current) {
          startRef.current.setText(formatted)
        }
        if (event.key === 'Enter') {
          if (endRef.current) {
            endRef.current.focus()
          }
        } else {
          dispatch({ type: 'closeCalendar' })
        }
        event.preventDefault()
      }
      return
    }
    // start up / down increment on current date
    let current = new Date()
    if (state.start) {
      current = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const adjusted = format(addDays(current, 1), ISO_8601_DATE_FORMAT)
      handleStartChange(adjusted)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const adjusted = format(subDays(current, 1), ISO_8601_DATE_FORMAT)
      handleStartChange(adjusted)
    }
    dispatch({ type: 'focus', focusInput: DateRangeInput.Start })
  }, [
    state,
    value,
    displayFormat,
    handleStartChange,
  ])
  const handleEndKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (state.calendarOpen) {
        const formatted = formatDate(value ? value.end : null, displayFormat)
        if (endRef.current) {
          endRef.current.setText(formatted)
        }
        dispatch({ type: 'closeCalendar' })
        event.preventDefault()
      }
      return
    }
    // start up / down increment on start date
    let current = new Date()
    let parsedStart = new Date()
    if (state.start) {
      parsedStart = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
      current = parsedStart
    }
    if (state.end) {
      current = parse(state.end, ISO_8601_DATE_FORMAT, new Date())
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      let next = addDays(current, 1)
      if (state.start) {
        next = max([next, parsedStart])
      }
      const adjusted = format(next, ISO_8601_DATE_FORMAT)
      handleEndChange(adjusted)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      let prev = subDays(current, 1)
      if (state.start) {
        prev = max([prev, parsedStart])
      }
      const adjusted = format(prev, ISO_8601_DATE_FORMAT)
      handleEndChange(adjusted)
    }
    dispatch({ type: 'focus', focusInput: DateRangeInput.End })
  }, [
    state,
    value,
    displayFormat,
    handleEndChange,
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<DateTextHandle>(null)
  const endRef = useRef<DateTextHandle>(null)
  const onBlur = useCallback(() => {
    dispatch({
      type: 'blur',
    })
    if (value && onChange) {
      const cleaned = cleanedValue(value)
      onChange(cleaned, true)
    }
  }, [value, onChange])
  const handleContainerClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = event.target as HTMLElement
    if (
      targetElement && (
        targetElement.closest('.MIRECO-text') ||
        targetElement.closest('.MIRECO-day-calendar') ||
        targetElement.closest('button')
      )
    ) {
      return
    }
    if (targetElement.closest('p')) {
      if (startRef.current) {
        startRef.current.focus()
      }
    } else {
      if (endRef.current) {
        endRef.current.focus()
      }
    }
  }, [])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
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
    onBlur()
  }, [onBlur])

  const handleStartFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DateRangeInput.Start })
  }, [])
  const handleEndFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DateRangeInput.End })
  }, [])
  const handleDateClick = useCallback(() => {
    dispatch({ type: 'showCalendar' })
  }, [])

  const handleClear = useCallback(() => {
    dispatch({ type: 'clear' })
    if (typeof onChange === 'function') {
      onChange({
        start: null,
        end: null,
      }, false)
    }
    if (startRef.current) {
      startRef.current.focus()
    }
  }, [onChange])

  const handleSelectDay = useCallback((day: DateValue) => {
    if (state.focusInput === DateRangeInput.Start) {
      handleStartChange(day)
      if (endRef.current) {
        endRef.current.focus()
      }
    } else {
      handleEndChange(day)
      if (endRef.current) {
        endRef.current.focus()
      }
      dispatch({ type: 'closeCalendar' })
    }
  }, [
    state,
    handleStartChange,
    handleEndChange,
  ])

  const hasValue = !!(value && (value.start || value.end))

  const dayInvalid = useCallback((day: DateValue) => {
    if (state.focusInput === DateRangeInput.Start) return undefined
    if (!state.start) return undefined
    const parsedStart = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
    const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
    if (parsedStart > parsedDay) return 'Before start date'
    return undefined
  }, [
    value,
    state,
  ])
  const dayHighlight = useCallback((day: DateValue, hovered: DateValue | undefined) => {
    const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
    if (state.focusInput === DateRangeInput.Start) {
      if (state.start && state.end) {
        const parsedStart = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
        const parsedEnd = parse(state.end, ISO_8601_DATE_FORMAT, new Date())
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      }
    } else {
      if (state.start && hovered) {
        const parsedStart = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
        const parsedEnd = parse(hovered, ISO_8601_DATE_FORMAT, new Date())
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      } else if (state.start && state.end) {
        const parsedStart = parse(state.start, ISO_8601_DATE_FORMAT, new Date())
        const parsedEnd = parse(state.end, ISO_8601_DATE_FORMAT, new Date())
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      }
    }
    return false
  }, [
    value,
    state,
  ])

  return (
    <WidgetBlock
      ref={containerRef}
      block={block}
      clearable={clearable && hasValue}
      everClearable={clearable}
      onClear={handleClear}
      icon={icon}
      inFocus={state.inFocus}
      disabled={disabled}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      id={id}
      style={style}
      className={classNames('MIRECO-date-range', className)}
    >
      <DateText
        ref={startRef}
        value={state.start}
        onChange={handleStartChange}
        size={size}
        onFocus={handleStartFocus}
        onKeyDown={handleStartKeyDown}
        onClick={handleDateClick}
        inputFormats={inputFormats}
        displayFormat={displayFormat}
        autoFocus={autoFocus}
        className="MIRECO-embedded"
      />
      <p>to</p>
      <DateText
        ref={endRef}
        value={state.end}
        onChange={handleEndChange}
        size={size}
        onFocus={handleEndFocus}
        onKeyDown={handleEndKeyDown}
        onClick={handleDateClick}
        inputFormats={inputFormats}
        displayFormat={displayFormat}
        className="MIRECO-embedded"
      />
      {state.inFocus && state.calendarOpen && !disabled && (
        <DayCalendar
          selectDay={handleSelectDay}
          current={state.focusInput === DateRangeInput.Start ? (value && value.start) : (value && value.end)}
          invalid={dayInvalid}
          highlight={dayHighlight}
        />
      )}
    </WidgetBlock>
  )
}
