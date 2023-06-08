import React, { useMemo, useState, useRef, useCallback, useEffect, forwardRef } from 'react'
import { startOfDay, format, parse } from 'date-fns'
import classNames from 'classnames'

import { Date as DateInput } from '../basic/date'
import { Time } from '../basic/time'
import { BlockDiv, ClearButton } from 'components'
import { ISO_8601_DATE_FORMAT } from 'constants'
import { isDateValue, isDatetimeValue, isTimeValue } from 'types'
import type {
  DatetimeValue,
  DatetimeInputValue,
  DateValue,
  DateInputValue,
  TimeValue,
  TimeInputValue,
} from 'types'

// todo: combine state into reducer

function datetimesEqual(datetime1: DatetimeInputValue, datetime2: DatetimeInputValue): boolean {
  return (datetime1 === datetime2)
}

function datetimeNull(datetime: DatetimeInputValue): boolean {
  return (datetime === null)
}

function dateNull(date: DateInputValue): boolean {
  return (date === null)
}

function dateAsMs(date: DateValue): number {
  return +parse(date, ISO_8601_DATE_FORMAT, new Date())
}

function combineDateTime(date: DateValue, time: TimeValue): DatetimeValue {
  return +startOfDay(parse(date, ISO_8601_DATE_FORMAT, new Date())) + time
}

interface SplitDatetime {
  date: DateInputValue
  time: TimeInputValue
}

function splitDatetime(value: DatetimeInputValue): SplitDatetime {
  if (value === null) {
    return {
      date: null,
      time: null,
    }
  }
  if (isDatetimeValue(value)) {
    const date = format(value!, ISO_8601_DATE_FORMAT)
    const time = value! - dateAsMs(date)
    return {
      date,
      time,
    }
  }
  return {
    date: undefined,
    time: undefined,
  }
}

interface DatetimeProps {
  // mireco
  block?: boolean
  // datetime
  value?: DatetimeInputValue
  onChange?(newValue: DatetimeInputValue, wasBlur: boolean): void
  relativeTo?: DatetimeValue
  defaultDate?: DateValue
  clearable?: boolean
  timeFirst?: boolean
  // children specific
  dateTextClassName?: string
  timeTextClassName?: string
  clearButtonClassName?: string
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
  onFocus?(event?: React.FocusEvent<HTMLInputElement>): void
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

export const Datetime = forwardRef<HTMLDivElement, DatetimeProps>(({
  block,
  value,
  onChange,
  relativeTo,
  defaultDate,
  clearable = true,
  timeFirst,
  dateTextClassName,
  timeTextClassName,
  clearButtonClassName,
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
}, forwardedRef) => {
  const splitValue = useMemo(() => (splitDatetime(value)), [value])
  const [date, setDate] = useState(splitValue.date)
  const [time, setTime] = useState(splitValue.time)

  const fallbackDefault: DateValue = defaultDate || format(new Date(), ISO_8601_DATE_FORMAT)
  const combinedState = useMemo(() => (combineDateTime(
    date || fallbackDefault,
    time || 0
  )), [
    fallbackDefault,
    date,
    time,
  ])

  useEffect(() => {
    if (!datetimesEqual(value, combinedState)) {
      if (datetimeNull(value)) {
        setDate(null)
        setTime(null)
      } else if (isDatetimeValue(value)) {
        const split = splitDatetime(value)
        setDate(split.date)
        setTime(split.time)
      }
    }
  }, [value])

  const updateParentValue = useCallback((newDate: DateInputValue, newTime: TimeInputValue) => {
    if (onChange) {
      if (dateNull(newDate) && datetimeNull(newTime)) {
        onChange(null, false)
      } else if (isDateValue(newDate) || isTimeValue(newTime)) {
        onChange(combineDateTime(
          newDate || fallbackDefault,
          newTime || 0
        ), false)
      } else {
        onChange(undefined, false)
      }
    }
  }, [
    onChange,
    fallbackDefault,
  ])
  const handleDateChange = useCallback((newValue: DateInputValue, wasBlur: boolean) => {
    setDate(newValue)
    updateParentValue(
      newValue,
      time
    )
  }, [
    updateParentValue,
    time,
  ])
  const handleTimeChange = useCallback((newValue: TimeInputValue, wasBlur: boolean) => {
    setTime(newValue)
    updateParentValue(
      date,
      newValue
    )
  }, [
    updateParentValue,
    date,
  ])
  
  const handleBlur = useCallback(() => {
    if (isDateValue(date) || isTimeValue(time)) {
      setDate(date || fallbackDefault)
      setTime(time || 0)
      if (onChange) {
        onChange(combinedState, true)
      }
    } else {
      setDate(null)
      setTime(null)
      if (onChange) {
        onChange(null, true)
      }
    }
  }, [
    combinedState,
    date,
    fallbackDefault,
    time,
    onChange,
  ])
  const containerRef = useRef<HTMLDivElement>()
  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget) {
      const dateContainer = dateRef.current ? dateRef.current.closest('.MIRECO-date') : null
      const containedInDate = (
        dateContainer &&
        (
          dateContainer.contains(event.relatedTarget) ||
          dateContainer == event.relatedTarget
        )
      )
      const timeContainer = timeRef.current ? timeRef.current.closest('.MIRECO-time') : null
      const containedInTime = (
        timeContainer &&
        (
          timeContainer.contains(event.relatedTarget) ||
          timeContainer == event.relatedTarget
        )
      )
      if (containedInDate || containedInTime) {
        // ignore internal blur
        return
      }
    }
    handleBlur()
  }, [
    handleBlur,
  ])
  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
    }
  }, [
    onChange,
  ])

  const dateProps: {
    id?: string
  } = {}
  if (!timeFirst) {
    dateProps.id = id
  }
  const dateInput = (
    <DateInput
      ref={dateRef}
      value={date}
      onChange={handleDateChange}
      disabled={disabled}
      block={block}
      rightHang={timeFirst}
      clearable={false}
      textClassName={dateTextClassName}
      {...dateProps}
    />
  )
  let relativeStart = undefined
  if (relativeTo && !datetimeNull(combinedState)) {
    relativeStart = +startOfDay(new Date(combinedState))
  }
  const timeProps: {
    id?: string
  } = {}
  if (timeFirst) {
    timeProps.id = id
  }
  const timeInput = (
    <Time
      ref={timeRef}
      value={time}
      onChange={handleTimeChange}
      disabled={disabled}
      relativeTo={relativeTo}
      relativeStart={relativeStart}
      block={block}
      clearable={false}
      textClassName={timeTextClassName}
      {...timeProps}
    />
  )

  let first = dateInput
  let second = timeInput
  if (timeFirst) {
    first = timeInput
    second = dateInput
  }

  return (
    <BlockDiv
      ref={(instance: HTMLDivElement) => {
        containerRef.current = instance;
        if (typeof forwardedRef === "function") {
          forwardedRef(instance)
        } else if (forwardedRef !== null) {
          forwardedRef.current = instance
        }
      }}
      block={block}
      className={classNames('MIRECO-datetime', className, {
        clearable,
      })}
      tabIndex={-1}
      onBlur={handleContainerBlur}
    >
      {first}
      {!block && <span>{' '}</span>}
      <BlockDiv block={block} className={classNames('second', {
        time: !timeFirst,
        date: timeFirst,
      })}>
        {second}
        {clearable && (
          <span>{' '}</span>
        )}
        {clearable && (
          <ClearButton
            onClick={handleClear}
            disabled={disabled}
            className={clearButtonClassName}
          />
        )}
      </BlockDiv>
    </BlockDiv>
  )
})
