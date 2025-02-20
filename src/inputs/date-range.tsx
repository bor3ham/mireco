import React, { useReducer, useCallback, useEffect, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { addDays, subDays, max } from 'date-fns'

import type { DateRangeInputValue, DateInputValue, DateValue, DateRangeValue } from 'types'
import { WidgetBlock, type WidgetBlockRef, DateText, type DateTextRef, DayCalendar, TimeRangePopover, type AdvancedPopoverRef } from 'components'
import Calendar from '../vectors/calendar.svg'
import { dateValueAsDate, dateAsDateValue } from 'types'
import { useInputKeyDownHandler } from 'hooks'

export interface DateRangeProps {
  // mireco
  block?: boolean
  marginless?: boolean
  rightHang?: boolean
  // date range
  value?: DateRangeInputValue
  onChange?(newValue: DateRangeInputValue, wasBlur: boolean): void
  locale?: string
  format?(value: DateInputValue, locale?: string): string
  parse?(value: string, locale?: string): DateInputValue
  icon?: React.ReactNode
  clearable?: boolean
  size?: number
  startPlaceholder?: string
  startId?: string
  endId?: string
  endPlaceholder?: string
  startClassName?: string
  endClassName?: string
  clearButtonClassName?: string
  shortcuts?: {
    value: DateRangeValue
    label: string
  }[],
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
  const parsedStart = dateValueAsDate(value.start)
  const parsedEnd = dateValueAsDate(value.end)
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
  marginless,
  rightHang,
  value,
  onChange,
  locale,
  format,
  parse,
  icon = <Calendar className="MIRECO-calendar" />,
  clearable = true,
  size = 12,
  startPlaceholder,
  endPlaceholder,
  startClassName,
  endClassName,
  clearButtonClassName,
  shortcuts,
  id,
  startId,
  endId,
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
    } else if (value === null) {
      dispatch({
        type: 'updateBoth',
        start: null,
        end: null,
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
  const handleBothChange = useCallback((newStart: DateInputValue, newEnd: DateInputValue) => {
    const newValue = {
      start: newStart,
      end: newEnd,
    }
    if (onChange) {
      onChange(newValue, false)
    } else {
      dispatch({
        type: 'updateBoth',
        ...newValue,
      })
    }
  }, [])

  const closeCalendar = useCallback(() => {
    dispatch({ type: 'closeCalendar' })
  }, [])

  const popoverRef = useRef<AdvancedPopoverRef>(null)
  const openShortcuts = useCallback(() => {
    if (popoverRef.current) {
      popoverRef.current.openShortcuts()
    }
  }, [])

  const cleanStart = useCallback(() => {
    if (startRef.current) startRef.current.cleanText()
    closeCalendar()
  }, [closeCalendar])
  const recordStartFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DateRangeInput.Start })
  }, [])
  // todo: handle submit case
  // if (event.key === 'Enter') {
  //   if (endRef.current) {
  //     endRef.current.focus()
  //   }
  // } else {
  //   dispatch({ type: 'closeCalendar' })
  // }
  const [fallbackStart, hasStart] = useMemo(() => {
    let has = false
    let fallback = new Date()
    if (state.start) {
      has = true
      fallback = dateValueAsDate(state.start)
    }
    return [fallback, has]
  }, [
    state.start,
  ])
  const decrementStart = useCallback(() => {
    const adjusted = dateAsDateValue(subDays(fallbackStart, hasStart ? 1 : 0))
    handleStartChange(adjusted)
  }, [
    fallbackStart,
    hasStart,
    handleStartChange,
  ])
  const incrementStart = useCallback(() => {
    const adjusted = dateAsDateValue(addDays(fallbackStart, hasStart ? 1 : 0))
    handleStartChange(adjusted)
  }, [
    fallbackStart,
    hasStart,
    handleStartChange,
  ])
  const handleStartKeyDown = useInputKeyDownHandler(
    state.calendarOpen,
    closeCalendar,
    cleanStart,
    recordStartFocus,
    decrementStart,
    incrementStart,
    openShortcuts,
  )

  const cleanEnd = useCallback(() => {
    if (endRef.current) endRef.current.cleanText()
      closeCalendar()
  }, [closeCalendar])
  const recordEndFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DateRangeInput.End })
  }, [])
  // todo: handle submit case
  // if (event.key === 'Enter') {
  //   if (endRef.current) {
  //     endRef.current.focus()
  //   }
  // } else {
  //   dispatch({ type: 'closeCalendar' })
  // }
  const [fallbackEnd, hasEnd] = useMemo(() => {
    let has = false
    let fallback = new Date()
    if (state.start) {
      fallback = dateValueAsDate(state.start)
    }
    if (state.end) {
      has = true
      fallback = dateValueAsDate(state.end)
    }
    return [fallback, has]
  }, [
    state.end,
    state.start,
  ])
  const decrementEnd = useCallback(() => {
    let adjusted = subDays(fallbackEnd, hasEnd ? 1 : 0)
    if (state.start) {
      adjusted = max([adjusted, dateValueAsDate(state.start)])
    }
    handleEndChange(dateAsDateValue(adjusted))
  }, [
    fallbackEnd,
    hasEnd,
    handleEndChange,
  ])
  const incrementEnd = useCallback(() => {
    let adjusted = addDays(fallbackEnd, hasEnd ? 1 : 0)
    if (state.start) {
      adjusted = max([adjusted, dateValueAsDate(state.start)])
    }
    handleEndChange(dateAsDateValue(adjusted))
  }, [
    fallbackEnd,
    hasEnd,
    handleEndChange,
  ])
  const handleEndKeyDown = useInputKeyDownHandler(
    state.calendarOpen,
    closeCalendar,
    cleanEnd,
    recordEndFocus,
    decrementEnd,
    incrementEnd,
    openShortcuts,
  )

  const containerRef = useRef<WidgetBlockRef>(null)
  const startRef = useRef<DateTextRef>(null)
  const endRef = useRef<DateTextRef>(null)
  const focusedOnStart = state.focusInput === DateRangeInput.Start
  const focusOnStart = useCallback(() => {
    if (startRef.current) {
      startRef.current.focus()
    }
  }, [])
  const focusOnEnd = useCallback(() => {
    if (endRef.current) {
      endRef.current.focus()
    }
  }, [])
  const focusOnCurrent = useCallback(() => {
    if (focusedOnStart) {
      focusOnStart()
    } else {
      focusOnEnd()
    }
  }, [focusOnStart, focusOnEnd, focusedOnStart])
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
    const inText = targetElement && targetElement.closest('input')
    const inButton = targetElement && targetElement.closest('button')
    const inShortcutsButton = inButton && inButton.classList.contains('shortcuts')
    const inHeaderButton = inButton && targetElement && targetElement.closest('div.calendar-header')
    if (inText || (inButton && !inShortcutsButton && !inHeaderButton)) return
    const inPopover = targetElement && targetElement.closest('.MIRECO-controls-popover')
    if (inPopover) {
      focusOnCurrent()
    } else if (targetElement.closest('p')) {
      focusOnStart()
    } else {
      focusOnEnd()
    }
  }, [
    focusOnCurrent,
    focusOnStart,
    focusOnEnd,
  ])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      containerRef.current.element &&
      (
        containerRef.current.element.contains(event.relatedTarget) ||
        containerRef.current.element === event.relatedTarget
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
      if (state.end) {
        const parsedDay = dateValueAsDate(day)
        const parsedEnd = dateValueAsDate(state.end)
        if (parsedDay > parsedEnd) {
          handleBothChange(day, null)
        } else {
          handleStartChange(day)
        }
      } else {
        handleStartChange(day)
      }
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
    handleBothChange,
    handleStartChange,
    handleEndChange,
  ])

  const hasValue = !!(value && (value.start || value.end))

  const calendarValue = useMemo(() => {
    if (state.focusInput === DateRangeInput.Start) {
      return value && value.start
    }
    return value && value.end
  }, [state.focusInput, value])
  const daySelected = useCallback((day: DateValue) => {
    const parsedDay = dateValueAsDate(day)
    if (state.start && state.end) {
      const parsedStart = dateValueAsDate(state.start)
      const parsedEnd = dateValueAsDate(state.end)
      return parsedDay >= parsedStart && parsedDay <= parsedEnd
    } else {
      return state.start === day || state.end === day
    }
  }, [
    state.start,
    state.end,
  ])
  const dayInvalid = useCallback((day: DateValue) => {
    if (state.focusInput === DateRangeInput.Start) return undefined
    if (!state.start) return undefined
    const parsedStart = dateValueAsDate(state.start)
    const parsedDay = dateValueAsDate(day)
    if (parsedStart > parsedDay) return 'Before start date'
    return undefined
  }, [
    value,
    state,
  ])
  const dayHighlight = useCallback((day: DateValue, hovered: DateValue | undefined) => {
    if (!hovered) return false
    const parsedDay = dateValueAsDate(day)
    let hoveredStart = state.start
    let hoveredEnd = state.end
    if (state.focusInput === DateRangeInput.Start) {
      hoveredStart = hovered
    } else {
      hoveredEnd = hovered
    }
    if (hoveredStart && hoveredEnd) {
      const parsedStart = dateValueAsDate(hoveredStart)
      const parsedEnd = dateValueAsDate(hoveredEnd)
      return parsedDay >= parsedStart && parsedDay <= parsedEnd
    }
    return false
  }, [
    value,
    state.start,
    state.end,
    state.focusInput,
  ])

  const handleSelectShortcut = useCallback((newValue: any) => {
    dispatch({
      type: 'updateBoth',
      start: newValue.start,
      end: newValue.end,
    })
    if (onChange) {
      onChange(newValue, false)
      focusOnEnd()
    }
  }, [onChange, focusOnEnd])

  return (
    <WidgetBlock
      ref={containerRef}
      block={block}
      marginless={marginless}
      clearable={clearable && hasValue}
      onClear={handleClear}
      icon={icon}
      inFocus={state.inFocus}
      disabled={disabled}
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      id={id}
      style={style}
      className={classNames('MIRECO-date-range', className)}
      clearButtonClassName={clearButtonClassName}
    >
      <DateText
        ref={startRef}
        value={state.start}
        onChange={handleStartChange}
        size={size}
        onFocus={handleStartFocus}
        onKeyDown={handleStartKeyDown}
        onClick={handleDateClick}
        locale={locale}
        format={format}
        parse={parse}
        autoFocus={autoFocus}
        className={classNames('MIRECO-embedded', startClassName)}
        disabled={disabled}
        placeholder={startPlaceholder}
        id={startId}
      />
      <p className="MIRECO-embedded">to</p>
      <DateText
        ref={endRef}
        value={state.end}
        onChange={handleEndChange}
        size={size}
        onFocus={handleEndFocus}
        onKeyDown={handleEndKeyDown}
        onClick={handleDateClick}
        locale={locale}
        format={format}
        parse={parse}
        className={classNames('MIRECO-embedded', endClassName)}
        disabled={disabled}
        placeholder={endPlaceholder}
        id={endId}
      />
      {state.inFocus && state.calendarOpen && !disabled && (
        <TimeRangePopover
          ref={popoverRef}
          className={classNames('MIRECO-date-range-controls', {'MIRECO-right-hang': rightHang})}
          focusedOnStart={focusedOnStart}
          focusOnStart={focusOnStart}
          focusOnEnd={focusOnEnd}
          shortcuts={shortcuts}
          onSelectShortcut={handleSelectShortcut}
          focusOnField={focusOnStart}
        >
          <DayCalendar
            className="MIRECO-embedded"
            selectDay={handleSelectDay}
            value={calendarValue}
            selected={daySelected}
            invalid={dayInvalid}
            highlight={dayHighlight}
          />
        </TimeRangePopover>
      )}
    </WidgetBlock>
  )
}
