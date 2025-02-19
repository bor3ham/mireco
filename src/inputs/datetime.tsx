import React, { useReducer, useRef, useCallback, useEffect, forwardRef, useMemo } from 'react'
import { addDays, subDays } from 'date-fns'
import classNames from 'classnames'

import {
  WidgetBlock,
  DateText,
  type DateTextRef,
  TimeText,
  type TimeTextRef,
  DayCalendar,
  TimeSelector,
  AdvancedPopover,
} from 'components'
import {
  type DatetimeInputValue,
  type DateValue,
  type DateInputValue,
  type TimeValue,
  type TimeInputValue,
  combineDatetimeValues,
  splitDatetimeValue,
  dateValueAsDate,
  dateAsDateValue,
  DateFormatFunction,
  DateParseFunction,
  TimeFormatFunction,
  TimeParseFunction,
} from 'types'
import Clock from '../vectors/clock.svg'
import { useInputKeyDownHandler } from 'hooks'

const DAY_MS = 24 * 60 * 60 * 1000

export interface DatetimeProps {
  // mireco
  block?: boolean
  rightHang?: boolean
  // datetime
  value?: DatetimeInputValue
  onChange?(newValue: DatetimeInputValue, wasBlur: boolean): void
  dateLocale?: string
  dateFormat?: DateFormatFunction
  dateParse?: DateParseFunction
  timeLocale?: string
  timeFormat?: TimeFormatFunction
  timeParse?: TimeParseFunction
  simplifyTime?: boolean
  datePlaceholder?: string
  timePlaceholder?: string
  /** Starting point for up/down with no value, or when other field filled and blurred */
  defaultDate?: DateValue
  /** Starting point for up/down with no value, or when other field filled and blurred */
  defaultTime?: number
  timeStep?: number
  icon?: React.ReactNode
  clearable?: boolean
  timeFirst?: boolean // todo: remove
  autoComplete?: string
  // children specific
  dateClassName?: string
  timeClassName?: string
  dateId?: string
  timeId?: string
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
  | { type: 'blur', date: DateInputValue, time: TimeInputValue }
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

export const Datetime = forwardRef<HTMLDivElement, DatetimeProps>(({
  block,
  rightHang,
  value,
  onChange,
  dateLocale,
  dateFormat,
  dateParse,
  timeLocale,
  timeFormat,
  timeParse,
  simplifyTime,
  datePlaceholder,
  timePlaceholder,
  dateId,
  timeId,
  timeStep = 5 * 60 * 1000,
  defaultDate,
  defaultTime = 9 * 60 * 60 * 1000,
  icon = <Clock className="MIRECO-clock" />,
  clearable = true,
  autoComplete,
  dateClassName,
  timeClassName,
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
    ...splitDatetimeValue(value),
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
      const split = splitDatetimeValue(value)
      const current = combineDatetimeValues(state.date, state.time, true, defaultDate, defaultTime)
      const currentSplit = splitDatetimeValue(current)
      const dateChanged = split.date != currentSplit.date
      const timeChanged = split.time != currentSplit.time
      if (dateChanged && timeChanged) {
        dispatch({
          type: 'updateBoth',
          ...split,
        })
      } else if (dateChanged) {
        dispatch({
          type: 'updateDate',
          value: split.date,
        })
      } else if (timeChanged) {
        dispatch({
          type: 'updateTime',
          value: split.time,
        })
      }
    }
  }, [
    value,
  ])

  const handleBlur = useCallback(() => {
    const fallback = combineDatetimeValues(state.date, state.time, true, defaultDate, defaultTime)
    const split = splitDatetimeValue(fallback)
    dispatch({
      type: 'blur',
      ...split,
    })
    if (onChange) {
      onChange(fallback, true)
    }
  }, [state.date, state.time, defaultDate, defaultTime, onChange])

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
      const newValue = combineDatetimeValues(newDate, state.time, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [onChange, state.time, defaultDate, defaultTime])
  const handleTimeChange = useCallback((newTime: TimeInputValue) => {
    dispatch({
      type: 'updateTime',
      value: newTime,
    })
    if (onChange) {
      const newValue = combineDatetimeValues(state.date, newTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [onChange, state.date, defaultDate, defaultTime])
  const handleBothChange = useCallback((newDate: DateInputValue, newTime: TimeInputValue) => {
    dispatch({
      type: 'updateBoth',
      date: newDate,
      time: newTime,
    })
    if (onChange) {
      const newValue = combineDatetimeValues(newDate, newTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [onChange, defaultDate, defaultTime])

  const containerRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<DateTextRef>(null)
  const timeRef = useRef<TimeTextRef>(null)
  const focusOnDate = useCallback(() => {
    if (dateRef.current) {
      dateRef.current.focus()
    }
  }, [])
  const focusOnTime = useCallback(() => {
    if (timeRef.current) {
      timeRef.current.focus()
    }
  }, [])
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
      focusOnDate()
    } else {
      focusOnTime()
    }
  }, [focusOnDate, focusOnTime])
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

  const handleTimeFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeInput.Time })
  }, [])
  const handleTextClick = useCallback(() => {
    dispatch({ type: 'showControls' })
  }, [])

  const closeControls = useCallback(() => {
    dispatch({ type: 'closeControls' })
  }, [])

  const cleanDate = useCallback(() => {
    if (dateRef.current) {
      dateRef.current.cleanText()
    }
    closeControls()
  }, [closeControls])
  const recordDateFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeInput.Date })
  }, [])
  const [fallbackDate, hasDate] = useMemo(() => {
    let has = false
    let fallback = defaultDate ? dateValueAsDate(defaultDate) : new Date()
    if (state.date) {
      has = true
      fallback = dateValueAsDate(state.date)
    }
    return [fallback, has]
  }, [defaultDate, state.date])
  const incrementDate = useCallback(() => {
    const next = addDays(fallbackDate, hasDate ? 1 : 0)
    handleDateChange(dateAsDateValue(next))
  }, [fallbackDate, hasDate, handleDateChange])
  const decrementDate = useCallback(() => {
    const prev = subDays(fallbackDate, hasDate ? 1 : 0)
    handleDateChange(dateAsDateValue(prev))
  }, [fallbackDate, hasDate, handleDateChange])
  const handleDateKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanDate,
    recordDateFocus,
    decrementDate,
    incrementDate,
  )

  const cleanTime = useCallback(() => {
    if (timeRef.current) {
      timeRef.current.cleanText()
    }
  }, [])
  const recordTimeFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeInput.Time })
  }, [])
  const [fallbackTime, hasTime] = useMemo(() => {
    let has = false
    let fallback = defaultTime
    if (typeof state.time === 'number') {
      has = true
      fallback = state.time
    }
    return [fallback, has]
  }, [defaultTime, state.time])
  const decrementTime = useCallback(() => {
    let earlier = Math.floor(fallbackTime / timeStep) * timeStep
    if (earlier === fallbackTime && hasTime) {
      earlier -= timeStep
    }
    let traversedDay = false
    if (earlier < 0) {
      traversedDay = true
      earlier += DAY_MS
    }
    if (traversedDay && state.date) {
      const newDate = subDays(dateValueAsDate(state.date), 1)
      handleBothChange(dateAsDateValue(newDate), earlier)
    } else {
      handleTimeChange(earlier)
    }
  }, [fallbackTime, timeStep, hasTime, state.date, handleBothChange, handleTimeChange])
  const incrementTime = useCallback(() => {
    let later = Math.ceil(fallbackTime / timeStep) * timeStep
    if (later === fallbackTime && hasTime) {
      later += timeStep
    }
    let traversedDay = false
    if (later >= DAY_MS) {
      traversedDay = true
      later = later % DAY_MS
    }
    if (traversedDay && state.date) {
      const newDate = addDays(dateValueAsDate(state.date), 1)
      handleBothChange(dateAsDateValue(newDate), later)
    } else {
      handleTimeChange(later)
    }
  }, [fallbackTime, timeStep, hasTime, state.date, handleBothChange, handleTimeChange])
  const handleTimeKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanTime,
    recordTimeFocus,
    decrementTime,
    incrementTime,
  )

  const handleSelectDay = useCallback((newValue: DateValue) => {
    handleDateChange(newValue)
    if (timeRef.current) {
      timeRef.current.focus()
    }
  }, [handleDateChange])
  const handleSelectTime = useCallback((newValue: TimeValue, final: boolean) => {
    handleTimeChange(newValue)
    if (final) {
      const fallback = combineDatetimeValues(state.date, newValue, true, defaultDate, defaultTime)
      const split = splitDatetimeValue(fallback)
      dispatch({
        type: 'blur',
        ...split,
      })
      if (onChange) {
        onChange(fallback, true)
      }
    }
  } , [handleTimeChange, state.date, defaultDate, defaultTime])

  const daySelected = useCallback((day: DateValue) => (
    day === state.date
  ), [state.date])

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
      clearButtonClassName={clearButtonClassName}
    >
      <DateText
        ref={dateRef}
        value={state.date}
        onChange={handleDateChange}
        size={12}
        onFocus={recordDateFocus}
        onKeyDown={handleDateKeyDown}
        onClick={handleTextClick}
        locale={dateLocale}
        format={dateFormat}
        parse={dateParse}
        disabled={disabled}
        className={classNames('MIRECO-embedded', dateClassName)}
        placeholder={datePlaceholder}
        id={dateId}
      />
      <TimeText
        ref={timeRef}
        value={state.time}
        onChange={handleTimeChange}
        size={9}
        onFocus={handleTimeFocus}
        onKeyDown={handleTimeKeyDown}
        onClick={handleTextClick}
        disabled={disabled}
        className={classNames('MIRECO-embedded', timeClassName)}
        locale={timeLocale}
        format={timeFormat}
        parse={timeParse}
        simplify={simplifyTime}
        placeholder={timePlaceholder}
        id={timeId}
      />
      {state.inFocus && state.controlsOpen && !disabled && (
        <AdvancedPopover
          className={classNames('MIRECO-datetime-controls', {'MIRECO-right-hang': rightHang})}
          focusOnField={focusOnDate}
        >
          <DayCalendar
            className="MIRECO-embedded"
            value={state.date}
            selectDay={handleSelectDay}
            selected={daySelected}
            // invalid={dayInvalid}
            // highlight={dayHighlight}
          />
          <TimeSelector
            className="MIRECO-embedded"
            value={state.time}
            onChange={handleSelectTime}
          />
        </AdvancedPopover>
      )}
    </WidgetBlock>
  )
})
