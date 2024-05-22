import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import { format, startOfDay, add } from 'date-fns'
import classNames from 'classnames'

import type { TimeValue, TimeInputValue } from 'types'

const A_SECOND_MS = 1000
const A_MINUTE_MS = 60 * A_SECOND_MS
const AN_HOUR_MS = 60 * A_MINUTE_MS

interface ValueOptionProps {
  value: number
  children: string
  current: boolean
  onClick(value: number): void
  onHovered(time: TimeValue | undefined): void
  highlight: boolean
  invalid?: string
}

const ValueOption: React.FC<ValueOptionProps> = ({
  value,
  children,
  current,
  onClick,
  onHovered,
  highlight,
  invalid,
}) => {
  const handleClick = useCallback(() => {
    onClick(value)
  }, [value, onClick])
  return (
    <li
      className={classNames({
        current,
        highlight,
        invalid,
      })}
      data-value={value}
    >
      <button
        tabIndex={-1}
        onClick={handleClick}
        onMouseEnter={() => {
          onHovered(value)
        }}
        onMouseLeave={() => {
          onHovered(undefined)
        }}
        type="button"
        disabled={!!invalid}
        title={invalid}
      >
        {children}
      </button>
    </li>
  )
}

type Value = {
  value: number
  label: string
}

interface ValueListProps {
  values: Value[]
  value?: TimeInputValue
  scrollOnChange?: boolean
  scrollStartMid?: boolean
  rounding: number
  onClick(value: number): void
  hovered: TimeValue | undefined
  onHovered(time: TimeValue | undefined): void
  highlight?(time: TimeValue, hovered: TimeValue | undefined, rounding: number): boolean
  invalid?(time: TimeValue, rounding: number): string | undefined
}

const ValueList: React.FC<ValueListProps> = ({
  values,
  value,
  scrollOnChange = false,
  scrollStartMid = false,
  rounding,
  onClick,
  hovered,
  onHovered,
  highlight,
  invalid,
}) => {
  const listRef = useRef<HTMLUListElement>(null)
  const scrollToOption = useCallback((option: HTMLElement) => {
    if (!listRef.current) return
    // don't use scroll into view because this also scrolls parent containers (the body included)
    const currentTop = option.offsetTop
    const currentBottom = currentTop + option.getBoundingClientRect().height
    const viewBottom = listRef.current.scrollTop + listRef.current.getBoundingClientRect().height
    if (listRef.current.scrollTop > currentTop) {
      listRef.current.scrollTop = currentTop
    }
    if (currentBottom > viewBottom) {
      listRef.current.scrollTop = currentBottom - listRef.current.getBoundingClientRect().height
    }
  }, [])
  useEffect(() => {
    if (scrollStartMid && listRef.current && !value) {
      const midChildIndex = Math.floor(listRef.current.childElementCount / 2)
      scrollToOption(listRef.current.children[midChildIndex] as HTMLElement)
    }
  }, [])
  useEffect(() => {
    if (!scrollOnChange) return
    if (typeof value !== 'number') return
    if (listRef.current) {
      let focusOption = undefined
      for (const child of listRef.current.children) {
        const asChild = child as HTMLElement
        if (asChild.dataset.value === `${value}`) {
          focusOption = asChild
        }
      }
      if (focusOption) {
        scrollToOption(focusOption)
      }
    }
  }, [value])
  return (
    <ul ref={listRef} tabIndex={-1}>
      {values.map((listValue) => (
        <ValueOption
          key={listValue.value}
          value={listValue.value}
          current={listValue.value === value}
          onClick={onClick}
          onHovered={onHovered}
          highlight={highlight ? highlight(listValue.value, hovered, rounding) : false}
          invalid={invalid ? invalid(listValue.value, rounding) : undefined}
        >
          {listValue.label}
        </ValueOption>
      ))}
    </ul>
  )
}

interface TimeSelectorProps {
  value?: TimeInputValue
  onChange?(value: TimeValue, final: boolean): void
  showSeconds?: boolean
  minuteIncrements?: number
  secondIncrements?: number
  className?: string
  highlight?(time: TimeValue, hovered: TimeValue | undefined, rounding: number): boolean
  invalid?(time: TimeValue, rounding: number): string | undefined
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  showSeconds = false,
  minuteIncrements = 15,
  secondIncrements = 15,
  className,
  highlight,
  invalid,
}) => {
  const hourValues = useMemo(() => {
    const hours = Array.from(Array.from(Array(24)).keys())
    return hours.map((hour) => {
      const asDate = add(startOfDay(new Date()), {
        hours: hour,
      })
      let hourValue = hour * AN_HOUR_MS
      if (value) {
        hourValue += value % AN_HOUR_MS
      }
      return ({
        value: hourValue,
        label: format(asDate, 'h 	aa'),
      })
    })
  }, [value])

  const valueHour = useMemo(() => {
    if (!value) {
      return 0
    }
    return value - (value % AN_HOUR_MS)
  }, [value])
  const minuteValues = useMemo(() => {
    const minutes: Value[] = []
    let minute = 0
    while (minute < 60) {
      let minuteValue = valueHour + minute * A_MINUTE_MS
      if (value) {
        minuteValue += value % A_MINUTE_MS
      }
      minutes.push({
        value: minuteValue,
        label: `${minute} m`,
      })
      minute += minuteIncrements
    }
    const rounded = (value: number) => (value - (value % A_MINUTE_MS))
    if (value && !minutes.find((minuteValue) => (
      rounded(minuteValue.value) === rounded(value)
    ))) {
      const asDate = new Date(+startOfDay(new Date()) + value)
      minutes.push({
        value,
        label: `${format(asDate, 'mm')} m`,
      })
      minutes.sort((a, b) => (a.value - b.value))
    }
    return minutes
  }, [minuteIncrements, value, valueHour])

  const valueMinute = useMemo(() => {
    if (!value) {
      return 0
    }
    return value - (value % A_MINUTE_MS)
  }, [value])
  const secondValues = useMemo(() => {
    const seconds: Value[] = []
    let second = 0
    while (second < 60) {
      seconds.push({
        value: valueMinute + second * A_SECOND_MS,
        label: `${second} s`,
      })
      second += secondIncrements
    }
    if (value && !seconds.find((secondValue) => (
      secondValue.value === value
    ))) {
      const asDate = new Date(+startOfDay(new Date()) + value)
      seconds.push({
        value,
        label: `${format(asDate, 'ss')} s`,
      })
      seconds.sort((a, b) => (a.value - b.value))
    }
    return seconds
  }, [secondIncrements, value, valueMinute])

  const handleClickHour = useCallback((value: number) => {
    if (onChange) {
      onChange(value, false)
    }
  }, [onChange])
  const handleClickMinute = useCallback((value: number) => {
    if (onChange) {
      onChange(value, !showSeconds)
    }
  }, [onChange, showSeconds])
  const handleClickSecond = useCallback((value: number) => {
    if (onChange) {
      onChange(value, true)
    }
  }, [onChange])

  const [hoveredTime, setHoveredTime] = useState<TimeValue | undefined>(undefined)
  const handleHovered = useCallback((time: TimeValue | undefined) => {
    setHoveredTime(time)
  }, [])

  return (
    <div className={classNames('MIRECO-time-selector MIRECO-controls-popover', className)}>
      <ValueList
        values={hourValues}
        value={value}
        scrollOnChange
        scrollStartMid
        rounding={AN_HOUR_MS}
        onClick={handleClickHour}
        highlight={highlight}
        invalid={invalid}
        hovered={hoveredTime}
        onHovered={handleHovered}
      />
      <ValueList
        values={minuteValues}
        value={value}
        rounding={A_MINUTE_MS}
        onClick={handleClickMinute}
        highlight={highlight}
        invalid={invalid}
        hovered={hoveredTime}
        onHovered={handleHovered}
      />
      {showSeconds && (
        <ValueList
          values={secondValues}
          value={value}
          rounding={A_SECOND_MS}
          onClick={handleClickSecond}
          highlight={highlight}
          invalid={invalid}
          hovered={hoveredTime}
          onHovered={handleHovered}
        />
      )}
    </div>
  )
}
