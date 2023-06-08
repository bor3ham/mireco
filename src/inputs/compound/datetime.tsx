import React, { useMemo, useState, useRef, useCallback, useEffect, forwardRef } from 'react'
import { startOfDay, format, parse } from 'date-fns'
import classNames from 'classnames'

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
import { Date as DateInput } from '../basic/date'
import { Time } from '../basic/time'

// todo: combine state into reducer
// todo: use name/required form with hidden input

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

  // respond to value change
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleDateChange = useCallback((newValue: DateInputValue) => {
    setDate(newValue)
    updateParentValue(
      newValue,
      time
    )
  }, [
    updateParentValue,
    time,
  ])
  const handleTimeChange = useCallback((newValue: TimeInputValue) => {
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
    if (onBlur) {
      onBlur()
    }
  }, [
    combinedState,
    date,
    fallbackDefault,
    time,
    onChange,
    onBlur,
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
          dateContainer === event.relatedTarget
        )
      )
      const timeContainer = timeRef.current ? timeRef.current.closest('.MIRECO-time') : null
      const containedInTime = (
        timeContainer &&
        (
          timeContainer.contains(event.relatedTarget) ||
          timeContainer === event.relatedTarget
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
    autoFocus?: boolean
  } = {}
  if (!timeFirst) {
    dateProps.id = id
    dateProps.autoFocus = autoFocus
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
  let relativeStart
  if (relativeTo && !datetimeNull(combinedState)) {
    relativeStart = +startOfDay(new Date(combinedState))
  }
  const timeProps: {
    id?: string
    autoFocus?: boolean
  } = {}
  if (timeFirst) {
    timeProps.id = id
    timeProps.autoFocus = autoFocus
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
        containerRef.current = instance
        if (typeof forwardedRef === "function") {
          forwardedRef(instance)
        } else if (forwardedRef !== null) {
          // eslint-disable-next-line no-param-reassign
          forwardedRef.current = instance
        }
      }}
      block={block}
      className={classNames('MIRECO-datetime', className, {
        clearable,
      })}
      tabIndex={-1}
      style={style}
      onFocus={onFocus}
      onBlur={handleContainerBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
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
