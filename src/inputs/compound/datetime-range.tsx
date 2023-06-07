import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { format } from 'date-fns'

import { Datetime } from './datetime'
import { BlockDiv, ClearButton } from 'components'
import { ISO_8601_DATE_FORMAT } from 'constants'
import type { DatetimeInputValue, DatetimeRangeInputValue, DurationValue } from 'types'
import { isDatetimeValue, isDatetimeRangeValue } from 'types'

// todo: combine start/end state into reducer

function datetimeNull(datetime: DatetimeInputValue): boolean {
  return datetime === null
}

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

function combineRange(start: DatetimeInputValue, end: DatetimeInputValue): DatetimeRangeInputValue {
  if (isDatetimeValue(start) && isDatetimeValue(end) && start! > end!) {
    let tempStart = start
    start = end
    end = tempStart
  }
  return {
    start,
    end,
  }
}

function rangeNull(range: DatetimeRangeInputValue): boolean {
  return range === null || (!!range && range.start === null && range.end === null)
}

function rangesEqual(range1: DatetimeRangeInputValue, range2: DatetimeRangeInputValue): boolean {
  if (typeof range1 === 'undefined' && typeof range2 === 'undefined') {
    return true
  }
  if (range1 === null && range2 === null) {
    return true
  }
  return (
    !!range1 &&
    !!range2 &&
    range1.start === range2.start &&
    range1.end === range2.end
  )
}

interface DatetimeRangeProps {
  // mireco
  block?: boolean
  // datetime range
  value?: DatetimeRangeInputValue
  onChange?(newValue: DatetimeRangeInputValue, wasBlur: boolean): void
  defaultDuration?: DurationValue
  clearable?: boolean,
  // children specific
  startDateTextClassName?: string
  startTimeTextClassName?: string
  endDateTextClassName?: string
  endTimeTextClassName?: string
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

export const DatetimeRange: React.FC<DatetimeRangeProps> = ({
  block,
  value,
  onChange,
  defaultDuration = 60 * 60 * 1000,
  clearable = true,
  startDateTextClassName,
  startTimeTextClassName,
  endDateTextClassName,
  endTimeTextClassName,
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const splitValue = useMemo(() => (splitRange(value)), [value])
  const [start, setStart] = useState(splitValue.start)
  const [end, setEnd] = useState(splitValue.end)

  const combinedState = useMemo(() => {
    if (!isDatetimeValue(start) && !isDatetimeValue(end)) {
      return combineRange(start, end)
    }
    const fallbackStart = isDatetimeValue(start) ? start : end! - defaultDuration
    const fallbackEnd = isDatetimeValue(end) ? end : start! + defaultDuration
    return combineRange(
      fallbackStart,
      fallbackEnd
    )
  }, [
    start,
    end,
    defaultDuration,
  ])

  useEffect(() => {
    if (!rangesEqual(value, combinedState)) {
      if (rangeNull(value)) {
        setStart(null)
        setEnd(null)
      } else if (isDatetimeRangeValue(value)) {
        const split = splitRange(value)
        setStart(split.start)
        setEnd(split.end)
      }
    }
  }, [
    value,
  ])

  const updateParentValue = useCallback((newStart: DatetimeInputValue, newEnd: DatetimeInputValue) => {
    if (onChange) {
      if (datetimeNull(newStart) && datetimeNull(newEnd)) {
        onChange(null, false)
      } else if (isDatetimeValue(newStart) || isDatetimeValue(newEnd)) {
        // todo: not right fallbacks
        onChange(combineRange(
          newStart || 0,
          newEnd || 0
        ), false)
      } else {
        onChange(undefined, false)
      }
    }
  }, [
    onChange,
  ])
  const handleStartChange = useCallback((newStart: DatetimeInputValue) => {
    let adjustedEnd = end
    if (isDatetimeValue(newStart) && isDatetimeValue(start) && isDatetimeValue(end)) {
      const prevDuration = Math.abs(+start! - +end!)
      adjustedEnd = newStart! + prevDuration
    }
    setStart(newStart)
    updateParentValue(newStart, adjustedEnd)
  }, [
    start,
    end,
    updateParentValue,
  ])
  const handleEndChange = useCallback((newEnd: DatetimeInputValue) => {
    setEnd(newEnd)
    updateParentValue(start, newEnd)
  }, [
    start,
    updateParentValue,
  ])

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
    }
  }, [])

  const handleBlur = useCallback(() => {
    if (combinedState) {
      setStart(combinedState.start)
      setEnd(combinedState.end)
      if (onChange) {
        onChange(combinedState, true)
      }
    } else {
      setStart(null)
      setEnd(null)
      if (onChange) {
        onChange(null, true)
      }
    }
  }, [
    combinedState,
    onChange,
  ])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
  //   if (event.relatedTarget) {
  //     const startDateDiv = (
  //       this.startRef.current
  //       && this.startRef.current.dateRef.current
  //       && this.startRef.current.dateRef.current.containerRef.current
  //     )
  //     const startTimeDiv = (
  //       this.startRef.current
  //       && this.startRef.current.timeRef.current
  //       && this.startRef.current.timeRef.current.containerRef.current
  //     )
  //     const containedInStart = (
  //       (startDateDiv && (
  //         startDateDiv.contains(event.relatedTarget)
  //         || event.relatedTarget === startDateDiv
  //       ))
  //       || (startTimeDiv && (
  //         startTimeDiv.contains(event.relatedTarget)
  //         || event.relatedTarget === startTimeDiv
  //       ))
  //     )
  //     const endDateDiv = (
  //       this.endRef.current
  //       && this.endRef.current.dateRef.current
  //       && this.endRef.current.dateRef.current.containerRef.current
  //     )
  //     const endTimeDiv = (
  //       this.endRef.current
  //       && this.endRef.current.timeRef.current
  //       && this.endRef.current.timeRef.current.containerRef.current
  //     )
  //     const containedInEnd = (
  //       (endDateDiv && (
  //         endDateDiv.contains(event.relatedTarget)
  //         || event.relatedTarget === endDateDiv
  //       ))
  //       || (endTimeDiv && (
  //         endTimeDiv.contains(event.relatedTarget)
  //         || event.relatedTarget === endTimeDiv
  //       ))
  //     )
  //     if (containedInStart || containedInEnd) {
  //       // ignore internal blur
  //       return
  //     }
  //   }
  //   handleBlur()
  }, [
    handleBlur,
  ])
  
  return (
    <BlockDiv
      block={block}
      ref={containerRef}
      className={classNames('MIRECO-datetime-range', className, {
        clearable,
      })}
      onBlur={handleContainerBlur}
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
      />
      <BlockDiv className="datetime-range-second" block={block}>
        <span className="to">{' - '}</span>
        <Datetime
          ref={endRef}
          value={end}
          onChange={handleEndChange}
          disabled={disabled}
          timeFirst={true}
          block={block}
          className="end"
          clearable={false}
          relativeTo={start ? start : undefined}
          defaultDate={isDatetimeValue(start) ? format(new Date(start!), ISO_8601_DATE_FORMAT) : undefined}
          dateTextClassName={endDateTextClassName}
          timeTextClassName={endTimeTextClassName}
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
}
