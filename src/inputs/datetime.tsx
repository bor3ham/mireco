import React, { useReducer, useRef, useCallback, useEffect, forwardRef } from 'react'
import { startOfDay, format, parse, addDays, subDays } from 'date-fns'
import classNames from 'classnames'

import {
  WidgetBlock,
  DateText,
  type DateTextHandle,
  TimeText,
  type TimeTextHandle,
  DayCalendar,
  TimeSelector,
} from 'components'
import { ISO_8601_DATE_FORMAT } from 'constants'
import type {
  DatetimeValue,
  DatetimeInputValue,
  DateValue,
  DateInputValue,
  TimeValue,
  TimeInputValue,
} from 'types'
import { ClockVector } from 'vectors'

const DAY_MS = 24 * 60 * 60 * 1000

export interface DatetimeProps {
  // mireco
  block?: boolean
  // datetime
  value?: DatetimeInputValue
  onChange?(newValue: DatetimeInputValue, wasBlur: boolean): void
  dateDisplayFormat?: string
  relativeTo?: DatetimeValue
  defaultDate?: DateValue
  timeInputFormats?: string[]
  timeLongFormat?: string
  timeDisplayFormat?: string
  simplifyTime?: boolean
  /** Starting point when using keyboard up/down with no value */
  timeStartingPoint?: number
  timeStep?: number
  icon?: React.ReactNode
  clearable?: boolean
  timeFirst?: boolean // todo: remove
  autoComplete?: string
  // children specific
  dateTextClassName?: string
  timeTextClassName?: string
  clearButtonClassName?: string
  // html
  id?: string
  autoFocus?: boolean
  style?: React.CSSProperties
  className?: string
  // form
  // name?: string
  // required?: boolean
  disabled?: boolean
  // event handlers
  onFocus?(event?: React.FocusEvent<HTMLDivElement>): void
  onBlur?(event?: React.FocusEvent<HTMLDivElement>): void
  onClick?(event: React.MouseEvent<HTMLDivElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLDivElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLDivElement>): void
}

enum DatetimeInput {
  Date = 'date',
  Time = 'time',
}

type DatetimeState = {
  date: DateInputValue
  time: TimeInputValue
  inFocus: boolean
  focusInput: DatetimeInput
  controlsOpen: boolean
}

type DatetimeAction =
  | { type: 'updateDate', value: DateInputValue }
  | { type: 'updateTime', value: TimeInputValue }
  | { type: 'updateBoth', date: DateInputValue, time: TimeInputValue }
  | { type: 'focus', focusInput: DatetimeInput }
  | { type: 'blur' }
  | { type: 'cleanedBlur', date: DateInputValue, time: TimeInputValue }
  | { type: 'clear' }
  | { type: 'closeControls' }
  | { type: 'showControls' }

function datetimeReducer(state: DatetimeState, action: DatetimeAction): DatetimeState {
  switch (action.type) {
    case 'updateDate': {
      return {
        ...state,
        date: action.value,
      }
    }
    case 'updateTime': {
      return {
        ...state,
        time: action.value,
      }
    }
    case 'updateBoth': {
      return {
        ...state,
        date: action.date,
        time: action.time,
      }
    }
    case 'focus': {
      return {
        ...state,
        inFocus: true,
        focusInput: action.focusInput,
        controlsOpen: true,
      }
    }
    case 'blur': {
      return {
        ...state,
        inFocus: false,
        focusInput: DatetimeInput.Date,
        controlsOpen: false,
      }
    }
    case 'cleanedBlur': {
      return {
        ...state,
        inFocus: false,
        controlsOpen: false,
        date: action.date,
        time: action.time,
      }
    }
    case 'clear': {
      return {
        ...state,
        date: null,
        time: null,
      }
    }
    case 'closeControls': {
      return {
        ...state,
        controlsOpen: false,
      }
    }
    case 'showControls': {
      return {
        ...state,
        controlsOpen: true,
      }
    }
    default: {
      return state
    }
  }
}

const splitValue = (value: DatetimeInputValue): {
  date: DateInputValue
  time: TimeInputValue
} => {
  if (typeof value === 'undefined') return {
    date: undefined,
    time: undefined,
  }
  if (value === null) return {
    date: null,
    time: null,
  }
  const asDate = new Date(value)
  return {
    date: format(asDate, ISO_8601_DATE_FORMAT),
    time: value - +(startOfDay(asDate)),
  }
}

const combineValues = (
  date: DateInputValue,
  time: TimeInputValue,
  fallback: boolean,
  timeStartingPoint?: number
): DatetimeInputValue => {
  if (date === null && time === null) return null
  if (typeof date === 'undefined' && typeof time === 'undefined') return undefined

  const dateValid = typeof date === 'string'
  const timeValid = typeof time === 'number'
  if (!timeValid && !dateValid) {
    if (fallback) return null
    return undefined
  }
  if (!(timeValid && dateValid) && !fallback) {
    return undefined
  }
  const parsedDate = date ? startOfDay(parse(date, ISO_8601_DATE_FORMAT, new Date())) : startOfDay(new Date())
  return +parsedDate + (time || (timeStartingPoint || 0))
}

export const Datetime = forwardRef<HTMLDivElement, DatetimeProps>(({
  block,
  value,
  onChange,
  dateDisplayFormat = 'do MMM yyyy',
  relativeTo,
  defaultDate,
  timeInputFormats = [
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
  timeLongFormat = 'h:mm:ss a',
  timeDisplayFormat = 'h:mm a',
  simplifyTime = false,
  timeStep = 15 * 60 * 1000,
  timeStartingPoint = 9 * 60 * 60 * 1000,
  icon = <ClockVector />,
  clearable = true,
  autoComplete,
  dateTextClassName,
  timeTextClassName,
  clearButtonClassName,
  id,
  autoFocus,
  style,
  className,
  // name,
  // required,
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
}, forwardedRef) => {
  const [state, dispatch] = useReducer(datetimeReducer, {
    ...splitValue(value),
    inFocus: false,
    focusInput: DatetimeInput.Date,
    controlsOpen: false,
  })

  useEffect(() => {
    if (value === null) {
      dispatch({
        type: 'clear',
      })
    } else if (typeof value === 'number') {
      dispatch({
        type: 'updateBoth',
        ...splitValue(value),
      })
    }
  }, [
    value,
  ])

  const handleBlur = useCallback(() => {
    const fallback = combineValues(state.date, state.time, true, timeStartingPoint)
    dispatch({
      type: 'blur',
    })
    if (onChange) {
      onChange(fallback, true)
    }
  }, [state.date, state.time, timeStartingPoint, onChange])

  // respond to disabled change
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disabled,
  ])

  const handleDateChange = useCallback((newDate: DateInputValue) => {
    dispatch({
      type: 'updateDate',
      value: newDate,
    })
    if (onChange) {
      const newValue = combineValues(newDate, state.time, false)
      onChange(newValue, false)
    }
  }, [onChange, state.time])
  const handleTimeChange = useCallback((newTime: TimeInputValue) => {
    dispatch({
      type: 'updateTime',
      value: newTime,
    })
    if (onChange) {
      const newValue = combineValues(state.date, newTime, false)
      onChange(newValue, false)
    }
  }, [onChange, state.date])
  const handleBothChange = useCallback((newDate: DateInputValue, newTime: TimeInputValue) => {
    dispatch({
      type: 'updateBoth',
      date: newDate,
      time: newTime,
    })
    if (onChange) {
      const newValue = combineValues(newDate, newTime, false)
      onChange(newValue, false)
    }
  }, [onChange])

  const containerRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<DateTextHandle>(null)
  const timeRef = useRef<TimeTextHandle>(null)
  const handleContainerClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = event.target as HTMLElement
    if (
      targetElement && (
        targetElement.closest('.MIRECO-text') ||
        targetElement.closest('.MIRECO-datetime-controls') ||
        targetElement.closest('button')
      )
    ) {
      return
    }
    if (targetElement.closest('p')) {
      if (dateRef.current) {
        dateRef.current.focus()
      }
    } else {
      if (timeRef.current) {
        timeRef.current.focus()
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
    handleBlur()
  }, [handleBlur])

  const hasValue = typeof state.date === 'string' || typeof state.time === 'number'

  const handleClear = useCallback(() => {
    dispatch({ type: 'clear' })
    if (onChange) {
      onChange(null, false)
    }
    if (dateRef.current) {
      dateRef.current.focus()
    }
  }, [onChange])

  const handleDateFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeInput.Date })
  }, [])
  const handleTimeFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeInput.Time })
  }, [])
  const handleTextClick = useCallback(() => {
    dispatch({ type: 'showControls' })
  }, [])
  
  const handleDateKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (state.controlsOpen) {
        if (dateRef.current) {
          dateRef.current.cleanText()
        }
        dispatch({ type: 'closeControls' })
        event.preventDefault()
      }
      return
    }
    let wasEmpty = true
    let current = new Date()
    if (state.date) {
      wasEmpty = false
      current = parse(state.date, ISO_8601_DATE_FORMAT, new Date())
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = addDays(current, wasEmpty ? 0 : 1)
      handleDateChange(format(next, ISO_8601_DATE_FORMAT))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = subDays(current, wasEmpty ? 0 : 1)
      handleDateChange(format(prev, ISO_8601_DATE_FORMAT))
    }
    dispatch({ type: 'focus', focusInput: DatetimeInput.Date })
  }, [
    state.controlsOpen,
    state.date,
    handleDateChange,
  ])
  const handleTimeKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (state.controlsOpen) {
        if (timeRef.current) {
          timeRef.current.cleanText()
        }
        dispatch({ type: 'closeControls' })
        event.preventDefault()
      }
      return
    }
    let wasEmpty = true
    let current = timeStartingPoint
    if (typeof state.time === 'number') {
      wasEmpty = false
      current = state.time
    }
    if (event.key === 'ArrowUp') {
      let loweredCurrent = Math.floor(current / timeStep) * timeStep
      if (loweredCurrent === current && !wasEmpty) {
        loweredCurrent -= timeStep
      }
      let traversedDay = false
      if (loweredCurrent < 0) {
        traversedDay = true
        loweredCurrent += DAY_MS
      }
      event.preventDefault()
      if (traversedDay && state.date) {
        const newDate = subDays(parse(state.date, ISO_8601_DATE_FORMAT, new Date()), 1)
        handleBothChange(format(newDate, ISO_8601_DATE_FORMAT), loweredCurrent)
      } else {
        handleTimeChange(loweredCurrent)
      }
    } else if (event.key === 'ArrowDown') {
      let raisedCurrent = Math.ceil(current / timeStep) * timeStep
      if (raisedCurrent === current && !wasEmpty) {
        raisedCurrent += timeStep
      }
      let traversedDay = false
      if (raisedCurrent >= DAY_MS) {
        traversedDay = true
        raisedCurrent = raisedCurrent % DAY_MS
      }
      event.preventDefault()
      if (traversedDay && state.date) {
        const newDate = addDays(parse(state.date, ISO_8601_DATE_FORMAT, new Date()), 1)
        handleBothChange(format(newDate, ISO_8601_DATE_FORMAT), raisedCurrent)
      } else {
        handleTimeChange(raisedCurrent)
      }
    }
    dispatch({ type: 'focus', focusInput: DatetimeInput.Time })
  }, [
    state.controlsOpen,
    state.time,
    handleTimeChange,
    state.date,
    handleBothChange,
    timeStartingPoint,
    timeStep,
  ])

  const handleSelectDay = useCallback((newValue: DateValue) => {
    handleDateChange(newValue)
    if (timeRef.current) {
      timeRef.current.focus()
    }
  }, [handleDateChange])
  const handleSelectTime = useCallback((newValue: TimeValue, final: boolean) => {
    handleTimeChange(newValue)
    if (final) {
      const fallback = combineValues(state.date, newValue, true, timeStartingPoint)
      dispatch({
        type: 'blur',
      })
      if (onChange) {
        onChange(fallback, true)
      }
    }
  } , [handleTimeChange, state.date, timeStartingPoint])


  return (
    <WidgetBlock
      ref={containerRef}
      className={classNames('MIRECO-datetime', className)}
      style={style}
      clearable={clearable && hasValue}
      everClearable={clearable}
      onClear={handleClear}
      icon={icon}
      inFocus={state.inFocus}
      disabled={disabled}
      block={block}
      id={id}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
    >
      <DateText
        ref={dateRef}
        value={state.date}
        onChange={handleDateChange}
        size={12}
        onFocus={handleDateFocus}
        onKeyDown={handleDateKeyDown}
        onClick={handleTextClick}
        displayFormat={dateDisplayFormat}
        disabled={disabled}
        className="MIRECO-embedded"
      />
      <p>,</p>
      <TimeText
        ref={timeRef}
        value={state.time}
        onChange={handleTimeChange}
        size={9}
        onFocus={handleTimeFocus}
        onKeyDown={handleTimeKeyDown}
        onClick={handleTextClick}
        disabled={disabled}
        className="MIRECO-embedded"
      />
      {state.inFocus && state.controlsOpen && !disabled && (
        <div className="MIRECO-datetime-controls">
          <DayCalendar
            className="MIRECO-embedded"
            current={state.date}
            selectDay={handleSelectDay}
            // invalid={dayInvalid}
            // highlight={dayHighlight}
          />
          <TimeSelector
            className="MIRECO-embedded"
            value={state.time}
            onChange={handleSelectTime}
          />
        </div>
      )}
    </WidgetBlock>
  )
})

