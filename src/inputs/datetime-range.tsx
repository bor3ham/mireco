import React, { forwardRef, useRef, useMemo, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'

import { BlockDiv, ClearButton } from 'components'
import { ISO_8601_DATE_FORMAT } from 'constants'
import { isDatetimeValue, cleanDatetimeRange } from 'types'
import type { DatetimeInputValue, DatetimeRangeInputValue, DurationValue } from 'types'
import { Datetime } from './datetime'

// todo: combine start/end state into reducer
// todo: use keypress instead of keydown
// todo: use form name/required with hidden value

function splitRange(range: DatetimeRangeInputValue): {
  start: DatetimeInputValue,
  end: DatetimeInputValue,
} {
  if (range === null) {
    return {
      start: null,
      end: null,
    }
  }
  if (range) {
    return {
      start: range.start,
      end: range.end,
    }
  }
  return {
    start: undefined,
    end: undefined,
  }
}

export interface DatetimeRangeProps {
  // mireco
  block?: boolean
  // datetime range
  value?: DatetimeRangeInputValue
  onChange?(newValue: DatetimeRangeInputValue, wasBlur: boolean): void
  defaultDuration?: DurationValue
  clearable?: boolean
  simplifyTimes?: boolean
  autoComplete?: string
  // children specific
  startDateTextClassName?: string
  startTimeTextClassName?: string
  endDateTextClassName?: string
  endTimeTextClassName?: string
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

export const DatetimeRange = forwardRef<HTMLDivElement, DatetimeRangeProps>(({
  block,
  value,
  onChange,
  defaultDuration = 60 * 60 * 1000,
  clearable = true,
  simplifyTimes = false,
  autoComplete,
  startDateTextClassName,
  startTimeTextClassName,
  endDateTextClassName,
  endTimeTextClassName,
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
}, ref) => {
  const splitValue = useMemo(() => (splitRange(value)), [
    value,
  ])
  const [start, setStart] = useState<DatetimeInputValue>(splitValue.start)
  const [end, setEnd] = useState<DatetimeInputValue>(splitValue.end)

  const [cleanedStart, cleanedEnd] = useMemo(() => {
    if (isDatetimeValue(start) && isDatetimeValue(end) && start! > end!) {
      return [end, start]
    }
    return [start, end]
  }, [
    start,
    end,
  ])

  const fallbackStart = useMemo(() => {
    if (isDatetimeValue(cleanedStart)) {
      return cleanedStart
    }
    if (isDatetimeValue(cleanedEnd)) {
      return cleanedEnd! - defaultDuration
    }
    return null
  }, [
    cleanedStart,
    cleanedEnd,
    defaultDuration,
  ])
  const fallbackEnd = useMemo(() => {
    if (isDatetimeValue(cleanedEnd)) {
      return cleanedEnd
    }
    if (isDatetimeValue(cleanedStart)) {
      return cleanedStart! + defaultDuration
    }
    return null
  }, [
    cleanedStart,
    cleanedEnd,
    defaultDuration,
  ])

  // respond to value change
  useEffect(() => {
    if (splitValue.start !== fallbackStart) {
      if (splitValue.start === null) {
        setStart(null)
      } else if (isDatetimeValue(splitValue.start)) {
        setStart(splitValue.start)
      }
    }
    if (splitValue.end !== fallbackEnd) {
      if (splitValue.end === null) {
        setEnd(null)
      } else if (isDatetimeValue(splitValue.end)) {
        setEnd(splitValue.end)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
  ])

  const handleStartChange = useCallback((newValue: DatetimeInputValue) => {
    setStart(newValue)
    if (!onChange) {
      return
    }
    if (newValue === null) {
      if (end === null) {
        onChange(null, false)
      } else if (isDatetimeValue(end)) {
        onChange(cleanDatetimeRange({
          start: end! - defaultDuration,
          end: end!,
        }), false)
      } else {
        onChange(undefined, false)
      }
    } else if (isDatetimeValue(newValue)) {
      if (end === null) {
        onChange(cleanDatetimeRange({
          start: newValue!,
          end: newValue! + defaultDuration,
        }), false)
      } else if (isDatetimeValue(end)) {
        let adjustedEnd = end!
        // if had a previous duration, shift end too
        if (isDatetimeValue(start) && start! < end!) {
          const prevDuration = Math.abs(start! - end!)
          adjustedEnd = newValue! + prevDuration
        }
        onChange(cleanDatetimeRange({
          start: newValue!,
          end: adjustedEnd,
        }), false)
      } else {
        onChange(undefined, false)
      }
    } else {
      onChange(undefined, false)
    }
  }, [
    onChange,
    start,
    end,
    defaultDuration,
  ])
  const handleEndChange = useCallback((newValue: DatetimeInputValue) => {
    setEnd(newValue)
    if (!onChange) {
      return
    }
    if (newValue === null) {
      if (start === null) {
        onChange(null, false)
      } else if (isDatetimeValue(start)) {
        onChange(cleanDatetimeRange({
          start: start!,
          end: start! + defaultDuration,
        }), false)
      } else {
        onChange(undefined, false)
      }
    } else if (isDatetimeValue(newValue)) {
      if (start === null) {
        onChange(cleanDatetimeRange({
          start: newValue! - defaultDuration,
          end: newValue!,
        }), false)
      } else if (isDatetimeValue(start)) {
        onChange(cleanDatetimeRange({
          start: start!,
          end: newValue!,
        }), false)
      } else {
        onChange(undefined, false)
      }
    } else {
      onChange(undefined, false)
    }
  }, [
    onChange,
    start,
    defaultDuration,
  ])
  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
    }
  }, [
    onChange,
  ])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (isDatetimeValue(cleanedStart) || isDatetimeValue(cleanedEnd)) {
      setStart(fallbackStart)
      setEnd(fallbackEnd)
      if (onChange) {
        onChange(cleanDatetimeRange({
          start: fallbackStart!,
          end: fallbackEnd!,
        }), true)
      }
    } else {
      setStart(null)
      setEnd(null)
      if (onChange) {
        onChange(null, true)
      }
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    cleanedStart,
    cleanedEnd,
    fallbackStart,
    fallbackEnd,
    onChange,
    onBlur,
  ])
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget) {
      const startContainer = startRef.current ? startRef.current.closest('.MIRECO-datetime') : null
      const containedInStart = startContainer && (
        event.relatedTarget === startContainer ||
        startContainer.contains(event.relatedTarget)
      )
        
      const endContainer = endRef.current ? endRef.current.closest('.MIRECO-datetime') : null
      const containedInEnd = endContainer && (
        event.relatedTarget === endContainer ||
        endContainer.contains(event.relatedTarget)
      )

      if (containedInStart || containedInEnd) {
        // ignore internal blur
        return
      }
    }
    handleBlur(event)
  }, [
    handleBlur,
  ])
  
  return (
    <BlockDiv
      ref={ref}
      block={block}
      className={classNames('MIRECO-datetime-range', className, {
        clearable,
      })}
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
      <Datetime
        ref={startRef}
        value={start}
        onChange={handleStartChange}
        disabled={disabled}
        block={block}
        className="start"
        clearable={false}
        defaultDate={isDatetimeValue(end) ? format(new Date(end!), ISO_8601_DATE_FORMAT) : undefined}
        dateTextClassName={startDateTextClassName}
        timeTextClassName={startTimeTextClassName}
        id={id}
        autoFocus={autoFocus}
        simplifyTime={simplifyTimes}
        autoComplete={autoComplete}
      />
      <BlockDiv className="datetime-range-second" block={block}>
        <span className="to">{' - '}</span>
        <Datetime
          ref={endRef}
          value={end}
          onChange={handleEndChange}
          disabled={disabled}
          timeFirst
          block={block}
          className="end"
          clearable={false}
          relativeTo={start || undefined}
          defaultDate={isDatetimeValue(start) ? format(new Date(start!), ISO_8601_DATE_FORMAT) : undefined}
          dateTextClassName={endDateTextClassName}
          timeTextClassName={endTimeTextClassName}
          simplifyTime={simplifyTimes}
          autoComplete={autoComplete}
        />
        {!block && clearable && (
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
