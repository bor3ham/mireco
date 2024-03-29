import React, { useReducer, useEffect, useCallback, useRef, useMemo } from 'react'
import { startOfDay, addDays, subDays, format } from 'date-fns'
import classNames from 'classnames'

import { WidgetBlock, DateText, TimeText, DayCalendar, TimeSelector, type DateTextHandle, type TimeTextHandle } from 'components'
import {
  type DatetimeRangeInputValue,
  type DateInputValue,
  type TimeInputValue,
  splitDatetimeRangeValue,
  combineDatetimeRangeValues,
  combineDatetimeValues,
  splitDatetimeValue,
  DateValue,
  TimeValue,
  dateValueAsDate,
  dateAsDateValue,
} from 'types'
import { Button } from './button'
import { ClockVector } from 'vectors'
import { useInputKeyDownHandler } from 'hooks'
import { ISO_8601_DATE_FORMAT } from 'constants'

const DAY_MS = 24 * 60 * 60 * 1000

export interface DatetimeRangeProps {
  block?: boolean
  value: DatetimeRangeInputValue
  onChange(newValue: DatetimeRangeInputValue, wasBlur: boolean): void
  disabled?: boolean
  icon?: React.ReactNode
  clearable?: boolean
  /** Starting point for up/down with no value, or when other field filled and blurred */
  defaultDate?: DateValue
  /** Starting point for up/down with no value, or when other field filled and blurred */
  defaultTime?: number
  timeStep?: number
}

enum DatetimeRangeInput {
  StartDate = 'startDate',
  StartTime = 'startTime',
  EndDate = 'endDate',
  EndTime = 'endTime',
}

type DatetimeRangeState = {
  startDate: DateInputValue
  startTime: TimeInputValue
  endDate: DateInputValue
  endTime: TimeInputValue
  inFocus: boolean
  focusInput: DatetimeRangeInput
  controlsOpen: boolean
  endDateShowing: boolean
}

type DatetimeRangeAction =
  | { type: 'updateStartDate', value: DateInputValue }
  | { type: 'updateStartTime', value: TimeInputValue }
  | { type: 'updateEndDate', value: DateInputValue }
  | { type: 'updateEndTime', value: TimeInputValue }
  | { type: 'updateStartBoth', date: DateInputValue, time: TimeInputValue }
  | { type: 'updateEndBoth', date: DateInputValue, time: TimeInputValue }
  | { type: 'updateAll', startDate: DateInputValue, startTime: TimeInputValue, endDate: DateInputValue, endTime: TimeInputValue }
  | { type: 'focus', focusInput: DatetimeRangeInput }
  | { type: 'blur' }
  | { type: 'cleanedBlur', startDate: DateInputValue, startTime: TimeInputValue, endDate: DateInputValue, endTime: TimeInputValue }
  | { type: 'clear' }
  | { type: 'clearStart' }
  | { type: 'clearEnd' }
  | { type: 'closeControls' }
  | { type: 'showControls' }
  | { type: 'showEndDate' }
  | { type: 'hideEndDate' }

function datetimeRangeReducer(state: DatetimeRangeState, action: DatetimeRangeAction): DatetimeRangeState {
  switch (action.type) {
    case 'updateStartDate': {
      return {
        ...state,
        startDate: action.value,
      }
    }
    case 'updateStartTime': {
      return {
        ...state,
        startTime: action.value,
      }
    }
    case 'updateStartBoth': {
      return {
        ...state,
        startDate: action.date,
        startTime: action.time,
      }
    }
    case 'updateEndDate': {
      return {
        ...state,
        endDate: action.value,
      }
    }
    case 'updateEndTime': {
      return {
        ...state,
        endTime: action.value,
      }
    }
    case 'updateEndBoth': {
      return {
        ...state,
        endDate: action.date,
        endTime: action.time,
      }
    }
    case 'updateAll': {
      return {
        ...state,
        startDate: action.startDate,
        startTime: action.startTime,
        endDate: action.endDate,
        endTime: action.endTime,
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
        focusInput: DatetimeRangeInput.StartDate,
        controlsOpen: false,
      }
    }
    case 'cleanedBlur': {
      return {
        ...state,
        inFocus: false,
        controlsOpen: false,
        startDate: action.startDate,
        startTime: action.startTime,
        endDate: action.endDate,
        endTime: action.endTime,
      }
    }
    case 'clear': {
      return {
        ...state,
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
      }
    }
    case 'clearStart': {
      return {
        ...state,
        startDate: null,
        startTime: null,
      }
    }
    case 'clearEnd': {
      return {
        ...state,
        endDate: null,
        endTime: null,
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
    case 'showEndDate': {
      return {
        ...state,
        endDateShowing: true,
      }
    }
    case 'hideEndDate': {
      return {
        ...state,
        endDate: null,
        endDateShowing: false,
      }
    }
    default: {
      return state
    }
  }
}

export const DatetimeRange: React.FC<DatetimeRangeProps> = ({
  block,
  value,
  onChange,
  disabled,
  icon = <ClockVector />,
  clearable = true,
  defaultDate,
  defaultTime = 9 * 60 * 60 * 1000,
  timeStep = 15 * 60 * 1000,
}) => {
  const [state, dispatch] = useReducer(datetimeRangeReducer, {
    ...splitDatetimeRangeValue(value),
    inFocus: false,
    focusInput: DatetimeRangeInput.StartDate,
    controlsOpen: false,
    endDateShowing: typeof value.end === 'number' && (
      typeof value.start !== 'number' ||
      format(value.end, ISO_8601_DATE_FORMAT) != format(value.start, ISO_8601_DATE_FORMAT)
    ),
  })

  useEffect(() => {
    if (value.start === null) {
      dispatch({
        type: 'clearStart',
      })
    } else if (typeof value.start === 'number') {
      const split = splitDatetimeValue(value.start)
      const current = combineDatetimeRangeValues(state.startDate, state.startTime, state.endDate, state.endTime, true, defaultDate, defaultTime)
      const currentSplit = splitDatetimeValue(current.start)
      const dateChanged = split.date != currentSplit.date
      const timeChanged = split.time != currentSplit.time
      if (dateChanged && timeChanged) {
        dispatch({
          type: 'updateStartBoth',
          ...split,
        })
      } else if (dateChanged) {
        dispatch({
          type: 'updateStartDate',
          value: split.date,
        })
      } else if (timeChanged) {
        dispatch({
          type: 'updateStartTime',
          value: split.time,
        })
      }
    }
    if (value.end === null) {
      dispatch({
        type: 'clearEnd',
      })
    } else if (typeof value.end === 'number') {
      const split = splitDatetimeValue(value.end)
      const current = combineDatetimeRangeValues(state.startDate, state.startTime, state.endDate, state.endTime, true, defaultDate, defaultTime)
      const currentSplit = splitDatetimeValue(current.end)
      const dateChanged = split.date != currentSplit.date
      const timeChanged = split.time != currentSplit.time
      if (dateChanged && timeChanged) {
        dispatch({
          type: 'updateEndBoth',
          ...split,
        })
      } else if (dateChanged) {
        dispatch({
          type: 'updateEndDate',
          value: split.date,
        })
      } else if (timeChanged) {
        dispatch({
          type: 'updateEndTime',
          value: split.time,
        })
      }
    }
  }, [
    value,
  ])

  const handleStartDateChange = useCallback((newDate: DateInputValue) => {
    dispatch({ type: 'updateStartDate', value: newDate })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(newDate, state.startTime, state.endDate, state.endTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.startTime,
    state.endDate,
    state.endTime,
    defaultDate,
    defaultTime,
  ])
  const handleStartTimeChange = useCallback((newTime: TimeInputValue) => {
    dispatch({ type: 'updateStartTime', value: newTime })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(state.startDate, newTime, state.endDate, state.endTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.startDate,
    state.endDate,
    state.endTime,
    defaultDate,
    defaultTime,
  ])
  const handleStartBothChange = useCallback((newDate: DateInputValue, newTime: TimeInputValue) => {
    dispatch({
      type: 'updateStartBoth',
      date: newDate,
      time: newTime,
    })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(newDate, newTime, state.endDate, state.endTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.endDate,
    state.endTime,
    defaultDate,
    defaultTime,
  ])
  const handleEndDateChange = useCallback((newDate: DateInputValue) => {
    dispatch({ type: 'updateEndDate', value: newDate })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(state.startDate, state.startTime, newDate, state.endTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.startDate,
    state.startTime,
    state.endTime,
    defaultDate,
    defaultTime,
  ])
  const handleEndTimeChange = useCallback((newTime: TimeInputValue) => {
    dispatch({ type: 'updateEndTime', value: newTime })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(state.startDate, state.startTime, state.endDate, newTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.startDate,
    state.startTime,
    state.endDate,
    defaultDate,
    defaultTime,
  ])
  const handleEndBothChange = useCallback((newDate: DateInputValue, newTime: TimeInputValue) => {
    dispatch({
      type: 'updateEndBoth',
      date: newDate,
      time: newTime,
    })
    if (onChange) {
      const newValue = combineDatetimeRangeValues(state.startDate, state.startTime, newDate, newTime, false, defaultDate, defaultTime)
      onChange(newValue, false)
    }
  }, [
    onChange,
    state.startDate,
    state.startTime,
    defaultDate,
    defaultTime,
  ])

  const handleTextClick = useCallback(() => {
    dispatch({ type: 'showControls' })
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const startDateRef = useRef<DateTextHandle>(null)
  const startTimeRef = useRef<TimeTextHandle>(null)
  const endDateRef = useRef<DateTextHandle>(null)
  const endTimeRef = useRef<TimeTextHandle>(null)
  const handleContainerClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = event.target as HTMLElement
    if (
      targetElement && (
        targetElement.closest('.MIRECO-text') ||
        targetElement.closest('.MIRECO-datetime-range-controls') ||
        targetElement.closest('button')
      )
    ) {
      return
    }
    if (targetElement.closest('p')) {
      if (startTimeRef.current) {
        startTimeRef.current.focus()
      }
    } else {
      if (endTimeRef.current) {
        endTimeRef.current.focus()
      }
    }
  }, [])
  const handleBlur = useCallback(() => {
    const fallback = combineDatetimeRangeValues(state.startDate, state.startTime, state.endDate, state.endTime, true, defaultDate, defaultTime)
    dispatch({
      type: 'blur',
    })
    if (onChange) {
      onChange(fallback, true)
    }
  }, [
    state.startDate,
    state.startTime,
    state.endDate,
    state.endTime,
    defaultDate,
    defaultTime,
    onChange,
  ])
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

  const handleClear = useCallback(() => {
    dispatch({ type: 'clear' })
    if (typeof onChange === 'function') {
      onChange({
        start: null,
        end: null,
      }, false)
    }
    if (startDateRef.current) {
      startDateRef.current.focus()
    }
  }, [onChange])
  const hasValue = !!(typeof value.start === 'number' || typeof value.end === 'number')

  const closeControls = useCallback(() => {
    dispatch({ type: 'closeControls' })
  }, [])

  const focusedOnStart = useMemo(() => (
    state.focusInput === DatetimeRangeInput.StartDate ||
    state.focusInput === DatetimeRangeInput.StartTime
  ), [
    state.focusInput,
  ])
  const handleSelectDay = useCallback((newValue: DateValue) => {
    if (focusedOnStart) {
      handleStartDateChange(newValue)
      if (startTimeRef.current) {
        startTimeRef.current.focus()
      }
    } else {
      handleEndDateChange(newValue)
      if (endTimeRef.current) {
        endTimeRef.current.focus()
      }
    }
  }, [
    focusedOnStart,
    handleStartDateChange,
    handleEndDateChange,
  ])
  const handleSelectTime = useCallback((newValue: TimeValue, final: boolean) => {
    if (focusedOnStart) {
      handleStartTimeChange(newValue)
      if (final) {
        if (endDateRef.current) {
          endDateRef.current.focus()
        } else if (endTimeRef.current) {
          endTimeRef.current.focus()
        }
      }
    } else {
      if (state.startDate && state.startTime) {
        const combinedStart = combineDatetimeValues(state.startDate, state.startTime, false)
        const combinedEnd = combineDatetimeValues(state.endDate || state.startDate, newValue, false)
        if (combinedEnd! < combinedStart!) {
          newValue = state.startTime
        }
      } else if (state.startTime) {
        if (newValue < state.startTime) {
          newValue = state.startTime
        }
      }
      handleEndTimeChange(newValue)
      if (final) {
        closeControls()
      }
    }
  }, [
    focusedOnStart,
    handleStartTimeChange,
    state.startDate,
    state.startTime,
    state.endDate,
    handleEndTimeChange,
    closeControls,
  ])

  const dayInvalid = useCallback((day: DateValue) => {
    if (focusedOnStart) return undefined
    if (!state.startDate) return undefined
    const startDay = startOfDay(dateValueAsDate(state.startDate))
    const parsedDay = dateValueAsDate(day)
    if (+startDay > +parsedDay) return 'Before start date'
    return undefined
  }, [
    focusedOnStart,
    state.startDate,
  ])
  const dayHighlight = useCallback((day: DateValue, hovered: DateValue | undefined) => {
    const parsedDay = dateValueAsDate(day)
    if (focusedOnStart) {
      if (state.startDate && state.endDate) {
        const parsedStart = startOfDay(dateValueAsDate(state.startDate))
        const parsedEnd = startOfDay(dateValueAsDate(state.endDate))
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      }
    } else {
      if (state.startDate && hovered) {
        const parsedStart = startOfDay(dateValueAsDate(state.startDate))
        const parsedEnd = dateValueAsDate(hovered)
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      } else if (state.startDate) {
        const fallbackEnd = state.endDate ? state.endDate : state.startDate
        const parsedStart = startOfDay(dateValueAsDate(state.startDate))
        const parsedEnd = startOfDay(dateValueAsDate(fallbackEnd))
        return parsedDay >= parsedStart && parsedDay <= parsedEnd
      }
    }
    return false
  }, [
    focusedOnStart,
    state.startDate,
    state.endDate,
  ])

  const timeInvalid = useCallback((time: TimeValue, rounding: number) => {
    if (focusedOnStart) return undefined
    if (typeof state.startTime !== 'number') return undefined
    if (state.startDate) {
      const combinedStart = combineDatetimeValues(state.startDate, state.startTime, false)
      const roundedStart = combinedStart! - (combinedStart! % rounding)
      const combinedTime = combineDatetimeValues(state.endDate || state.startDate!, time, false)
      if (combinedTime! < roundedStart) return 'Before start time'
    } else {
      const roundedStart = state.startTime - (state.startTime % rounding)
      if (time < roundedStart) return 'Before start time'
    }
    return undefined
  }, [
    focusedOnStart,
    state.startTime,
    state.startDate,
    state.endDate,
  ])
  const timeHighlight = useCallback((time: TimeValue, hovered: TimeValue | undefined, rounding: number) => {
    if (focusedOnStart && !state.endTime) return false
    if (!focusedOnStart && !state.startTime) return false

    let fallbackStart = state.startDate || defaultDate
    let fallbackEnd = state.endDate || fallbackStart
    let rangeTime = time
    let rangeStart = combineDatetimeValues(fallbackStart, state.startTime, false)
    let rangeEnd = combineDatetimeValues(fallbackEnd, state.endTime, false)
    if (focusedOnStart) {
      rangeTime = combineDatetimeValues(fallbackStart, time, false)!
      if (hovered) {
        rangeStart = combineDatetimeValues(fallbackStart, hovered, false)
      }
    } else {
      rangeTime = combineDatetimeValues(fallbackEnd, time, false)!
      if (hovered) {
        rangeEnd = combineDatetimeValues(fallbackEnd, hovered, false)
      }
    }
    const roundedStart = rangeStart! - (rangeStart! % rounding)
    const roundedTime = rangeTime - (rangeTime % rounding)
    return (
      rangeTime >= roundedStart && roundedTime <= rangeEnd!
    )
  }, [
    focusedOnStart,
    state.endTime,
    state.startTime,
    state.startDate,
    defaultDate,
    state.endDate,
  ])

  const handleStartClick = useCallback(() => {
    if (startDateRef.current) {
      startDateRef.current.focus()
    }
  }, [])
  const handleEndClick = useCallback(() => {
    if (endDateRef.current) {
      endDateRef.current.focus()
    } else if (endTimeRef.current) {
      endTimeRef.current.focus()
    }
  }, [])

  const cleanStartDate = useCallback(() => {
    if (startDateRef.current) startDateRef.current.cleanText()
  }, [])
  const recordStartDateFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeRangeInput.StartDate })
  }, [])
  const [fallbackStartDate, hasStartDate] = useMemo(() => {
    let has = false
    let fallback = defaultDate ? dateValueAsDate(defaultDate) : new Date()
    if (state.startDate) {
      has = true
      fallback = dateValueAsDate(state.startDate)
    }
    return [fallback, has]
  }, [defaultDate, state.startDate])
  const incrementStartDate = useCallback(() => {
    const next = addDays(fallbackStartDate, hasStartDate ? 1 : 0)
    handleStartDateChange(dateAsDateValue(next))
  }, [fallbackStartDate, hasStartDate, handleStartDateChange])
  const decrementStartDate = useCallback(() => {
    const prev = subDays(fallbackStartDate, hasStartDate ? 1 : 0)
    handleStartDateChange(dateAsDateValue(prev))
  }, [fallbackStartDate, hasStartDate, handleStartDateChange])
  const handleStartDateKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanStartDate,
    recordStartDateFocus,
    decrementStartDate,
    incrementStartDate,
  )

  const cleanStartTime = useCallback(() => {
    if (startTimeRef.current) startTimeRef.current.cleanText()
  }, [])
  const recordStartTimeFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeRangeInput.StartTime })
  }, [])
  const [fallbackStartTime, hasStartTime] = useMemo(() => {
    let has = false
    let fallback = defaultTime
    if (typeof state.startTime === 'number') {
      has = true
      fallback = state.startTime
    }
    return [fallback, has]
  }, [defaultTime, state.startTime])
  const incrementStartTime = useCallback(() => {
    let raised = Math.ceil(fallbackStartTime / timeStep) * timeStep
    if (raised === fallbackStartTime && hasStartTime) {
      raised += timeStep
    }
    let traversedDay = false
    if (raised >= DAY_MS) {
      traversedDay = true
      raised = raised % DAY_MS
    }
    if (traversedDay && state.startDate) {
      const newDate = addDays(dateValueAsDate(state.startDate), 1)
      handleStartBothChange(dateAsDateValue(newDate), raised)
    } else {
      handleStartTimeChange(raised)
    }
  }, [fallbackStartTime, timeStep, hasStartTime, state.startDate, handleStartBothChange, handleStartTimeChange])
  const decrementStartTime = useCallback(() => {
    let lowered = Math.floor(fallbackStartTime / timeStep) * timeStep
    if (lowered === fallbackStartTime && hasStartTime) {
      lowered -= timeStep
    }
    let traversedDay = false
    if (lowered < 0) {
      traversedDay = true
      lowered += DAY_MS
    }
    if (traversedDay && state.startDate) {
      const newDate = subDays(dateValueAsDate(state.startDate), 1)
      handleStartBothChange(dateAsDateValue(newDate), lowered)
    } else {
      handleStartTimeChange(lowered)
    }
  }, [fallbackStartTime, timeStep, hasStartTime, state.startDate, handleStartBothChange, handleStartTimeChange])
  const handleStartTimeKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanStartTime,
    recordStartTimeFocus,
    decrementStartTime,
    incrementStartTime,
  )

  const cleanEndDate = useCallback(() => {
    if (endDateRef.current) endDateRef.current.cleanText()
  }, [])
  const recordEndDateFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeRangeInput.EndDate })
  }, [])
  const [fallbackEndDate, hasEndDate] = useMemo(() => {
    let fallback = defaultDate ? dateValueAsDate(defaultDate) : new Date()
    let has = false
    if (state.startDate) {
      fallback = dateValueAsDate(state.startDate)
      has = true
    }
    if (state.endDate) {
      fallback = dateValueAsDate(state.endDate)
      has = true
    }
    return [fallback, has]
  }, [defaultDate, state.startDate, state.endDate])
  const incrementEndDate = useCallback(() => {
    let next = addDays(fallbackEndDate, hasEndDate ? 1 : 0)
    if (state.startDate) {
      const start = dateValueAsDate(state.startDate)
      if (next < start) {
        next = start
      }
    }
    handleEndDateChange(dateAsDateValue(next))
  }, [fallbackEndDate, hasEndDate, state.startDate, handleEndDateChange])
  const decrementEndDate = useCallback(() => {
    let prev = subDays(fallbackEndDate, hasEndDate ? 1 : 0)
    if (state.startDate) {
      const start = dateValueAsDate(state.startDate)
      if (prev < start) {
        prev = start
      }
    }
    handleEndDateChange(dateAsDateValue(prev))
  }, [fallbackEndDate, hasEndDate, state.startDate, handleEndDateChange])
  const handleEndDateKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanEndDate,
    recordEndDateFocus,
    decrementEndDate,
    incrementEndDate,
  )

  const cleanEndTime = useCallback(() => {
    if (endTimeRef.current) endTimeRef.current.cleanText()
  }, [])
  const recordEndTimeFocus = useCallback(() => {
    dispatch({ type: 'focus', focusInput: DatetimeRangeInput.EndTime })
  }, [])
  const [fallbackEndTime, hasEndTime] = useMemo(() => {
    let fallback = defaultTime
    let has = false
    if (typeof state.startTime === 'number') {
      fallback = state.startTime
    }
    if (typeof state.endTime === 'number') {
      fallback = state.endTime
      has = true
    }
    return [fallback, has]
  }, [defaultTime, state.startTime, state.endTime])
  const incrementEndTime = useCallback(() => {
    let adjustedDate = state.endDate || state.startDate
    let adjustedTime = Math.ceil(fallbackEndTime / timeStep) * timeStep
    if (adjustedTime === fallbackEndTime && hasEndTime) {
      adjustedTime += timeStep
    }
    let dateChanged = false
    if (adjustedTime >= DAY_MS) {
      if (adjustedDate) {
        dateChanged = true
        adjustedDate = dateAsDateValue(addDays(dateValueAsDate(adjustedDate), 1))
      }
      adjustedTime = adjustedTime % DAY_MS
    }
    if (state.startDate && typeof state.startTime === 'number') {
      // limit to the start
      const combinedStart = combineDatetimeValues(state.startDate, state.startTime, false)
      const combinedEnd = combineDatetimeValues(adjustedDate, adjustedTime, false)
      if (combinedEnd! < combinedStart!) {
        dateChanged = true
        adjustedDate = state.startDate
        adjustedTime = state.startTime
      }
    }
    if (dateChanged) {
      handleEndBothChange(adjustedDate, adjustedTime)
    } else {
      handleEndTimeChange(adjustedTime)
    }
  }, [state.endDate, state.startDate, fallbackEndTime, timeStep, hasEndTime, state.startTime, handleEndBothChange, handleEndTimeChange])
  const decrementEndTime = useCallback(() => {
    let adjustedDate = state.endDate || state.startDate
    let adjustedTime = Math.floor(fallbackEndTime / timeStep) * timeStep
    if (adjustedTime === fallbackEndTime && hasEndTime) {
      adjustedTime -= timeStep
    }
    let dateChanged = false
    if (adjustedTime < 0) {
      if (adjustedDate) {
        dateChanged = true
        adjustedDate = dateAsDateValue(subDays(dateValueAsDate(adjustedDate), 1))
      }
      adjustedTime += DAY_MS
    }
    if (state.startDate && typeof state.startTime === 'number') {
      // limit to the start
      const combinedStart = combineDatetimeValues(state.startDate, state.startTime, false)
      const combinedEnd = combineDatetimeValues(adjustedDate, adjustedTime, false)
      if (combinedEnd! < combinedStart!) {
        dateChanged = true
        adjustedDate = state.startDate
        adjustedTime = state.startTime
      }
    }
    if (dateChanged) {
      handleEndBothChange(adjustedDate, adjustedTime)
    } else {
      handleEndTimeChange(adjustedTime)
    }
  }, [state.endDate, state.startDate, fallbackEndTime, timeStep, hasEndTime, state.startTime, handleEndBothChange, handleEndTimeChange])
  const handleEndTimeKeyDown = useInputKeyDownHandler(
    state.controlsOpen,
    closeControls,
    cleanEndTime,
    recordEndTimeFocus,
    decrementEndTime,
    incrementEndTime,
  )

  const endDateDiffers = useMemo(() => (
    state.endDate && (
      !state.startDate ||
      state.startDate != state.endDate
    )
  ), [state.endDate, state.startDate])
  useEffect(() => {
    if (endDateDiffers) {
      dispatch({ type: 'showEndDate' })
    } else if (focusedOnStart) {
      dispatch({ type: 'hideEndDate' })
    }
  }, [focusedOnStart, endDateDiffers])

  useEffect(() => {
    if (state.startDate && typeof state.startTime !== 'number' && (
      !state.inFocus || !focusedOnStart
    )) {
      dispatch({ type: 'updateStartTime', value: defaultTime })
    }
    if (typeof state.startTime === 'number' && !state.startDate && (
      !state.inFocus || !focusedOnStart
    )) {
      dispatch({ type: 'updateStartDate', value: defaultDate ? defaultDate : dateAsDateValue(new Date()) })
    }
    if (state.endDate && typeof state.endTime !== 'number' && (
      !state.inFocus || focusedOnStart
    )) {
      dispatch({ type: 'updateEndTime', value: state.startTime || defaultTime })
    }
  }, [
    state.inFocus,
    focusedOnStart,
  ])

  // todo: swap start/end when blur wrong
  // todo: close controls etc as response to disable

  return (
    <WidgetBlock
      ref={containerRef}
      block={block}
      className="MIRECO-datetime-range"
      onClick={handleContainerClick}
      onBlur={handleContainerBlur}
      icon={icon}
      clearable={clearable && hasValue}
      everClearable={clearable}
      disabled={disabled}
      onClear={handleClear}
    >
      <DateText
        ref={startDateRef}
        value={state.startDate}
        onChange={handleStartDateChange}
        onFocus={recordStartDateFocus}
        onClick={handleTextClick}
        className="MIRECO-embedded"
        size={12}
        disabled={disabled}
        onKeyDown={handleStartDateKeyDown}
      />
      <TimeText
        ref={startTimeRef}
        value={state.startTime}
        onChange={handleStartTimeChange}
        onFocus={recordStartTimeFocus}
        onClick={handleTextClick}
        className="MIRECO-embedded"
        size={9}
        disabled={disabled}
        onKeyDown={handleStartTimeKeyDown}
      />
      <p>to</p>
      {state.endDateShowing && (
        <DateText
          ref={endDateRef}
          value={state.endDate}
          onChange={handleEndDateChange}
          onFocus={recordEndDateFocus}
          onClick={handleTextClick}
          className="MIRECO-embedded"
          size={12}
          disabled={disabled}
          onKeyDown={handleEndDateKeyDown}
        />
      )}
      <TimeText
        ref={endTimeRef}
        value={state.endTime}
        onChange={handleEndTimeChange}
        onFocus={recordEndTimeFocus}
        onClick={handleTextClick}
        className="MIRECO-embedded"
        size={9}
        disabled={disabled}
        onKeyDown={handleEndTimeKeyDown}
      />
      {state.inFocus && state.controlsOpen && !disabled && (
        <div className="MIRECO-datetime-range-controls">
          <div className="MIRECO-datetime-range-header">
            <Button
              className={classNames({
                'other': !focusedOnStart,
              })}
              onClick={handleStartClick}
              tabIndex={-1}
            >
              Start
            </Button>
            {' '}
            <Button
              className={classNames({
                'other': focusedOnStart,
              })}
              onClick={handleEndClick}
              tabIndex={-1}
            >
              End
            </Button>
          </div>
          <div className="MIRECO-datetime-range-body">
            <DayCalendar
              className="MIRECO-embedded"
              current={focusedOnStart ? state.startDate : (state.endDate || state.startDate)}
              selectDay={handleSelectDay}
              invalid={dayInvalid}
              highlight={dayHighlight}
            />
            <TimeSelector
              className="MIRECO-embedded"
              value={focusedOnStart ? state.startTime : state.endTime}
              onChange={handleSelectTime}
              invalid={timeInvalid}
              highlight={timeHighlight}
            />
          </div>
        </div>
      )}
    </WidgetBlock>
  )
}
