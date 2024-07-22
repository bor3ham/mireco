import React, { useMemo, useRef, useCallback, useEffect } from 'react'
import { format } from 'date-fns'
import classNames from 'classnames'

import type { TimeValue, TimeInputValue } from 'types'

const A_SECOND_MS = 1000
const A_MINUTE_MS = 60 * A_SECOND_MS
const AN_HOUR_MS = 60 * A_MINUTE_MS

interface WheelProps {
  options: {
    label: string
    value: number
  }[]
  continuous?: boolean
  value?: number
  blank: number
  onChange(newValue: number): void
  height: number
  itemHeight?: number
}

const Wheel = ({
  options,
  continuous,
  value,
  blank,
  onChange,
  height,
  itemHeight = 30,
}: WheelProps) => {
  const fallback = useMemo(() => {
    if (typeof value !== 'undefined') return value
    return blank
  }, [value, blank])
  const repeated = useMemo(() => {
    const r: {
      option: {
        value: number
        label: string
      }
      iteration: number
    }[] = []
    options.forEach((option) => (r.push({
      iteration: 0,
      option,
    })))
    if (continuous) {
      options.forEach((option) => (r.push({
        iteration: 1,
        option,
      })))
      options.forEach((option) => (r.push({
        iteration: 2,
        option,
      })))
    }
    return r
  }, [
    options,
    continuous,
  ])
  const [paddingTop, paddingBottom] = useMemo(() => {
    let top = 0
    let bottom = 0
    if (!continuous) {
      const itemsHeight = itemHeight * (options.length - 1)
      const totalPadding = Math.max(height - itemsHeight, 0)
      top = totalPadding / 2
      bottom = totalPadding / 2
    }
    return [top, bottom]
  }, [continuous, itemHeight, options])
  const items = useMemo(() => {
    return repeated.map((repeat, index) => {
      return (
        <li
          key={`${repeat.option.value}-${repeat.iteration}`}
          className={classNames({
            current: repeat.option.value === value,
          })}
        >
          <button
            tabIndex={-1}
            onClick={() => {
              onChange(repeat.option.value)
            }}
            style={{
              height: `${itemHeight}px`,
            }}
          >
            {repeat.option.label}
          </button>
        </li>
      )
    })
  }, [
    repeated,
    onChange,
    value,
    itemHeight,
  ])
  const listRef = useRef<HTMLUListElement>(null)
  const initialisedAt = useRef<Date | undefined>(undefined)
  // start scroll in middle iteration & on value
  useEffect(() => {
    if (listRef.current) {
      let index = options.findIndex((option) => (option.value === fallback))
      if (typeof index === 'number') {
        let itemTop = index * itemHeight
        if (continuous) {
          itemTop += options.length * itemHeight
        }
        const scrollTop = itemTop + (itemHeight / 2) - (height / 2) + paddingTop
        listRef.current.scrollTop = scrollTop
      }
    }
    initialisedAt.current = new Date()
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (typeof value === 'number' && listRef.current) {
        let index = options.findIndex((option) => (option.value === value))
        if (typeof index === 'number') {
          let itemTop = index * itemHeight
          if (continuous) {
            itemTop += options.length * itemHeight
          }
          const scrollTop = itemTop + (itemHeight / 2) - (height / 2) + paddingTop
          listRef.current.scrollTop = scrollTop
          // listRef.current.scrollTo({
          //   top: scrollTop,
          //   left: 0,
          //   behavior: 'instant',
          // })
        }
      }
    }, 300)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [value])

  const handleScroll = useCallback(() => {
    if (
      typeof initialisedAt.current !== 'undefined' &&
      new Date().valueOf() > initialisedAt.current.valueOf() + 50
    ) {
      if (listRef.current) {
        if (continuous) {
          const fullLength = itemHeight * options.length
          if (listRef.current.scrollTop < fullLength) {
            listRef.current.scrollTop = listRef.current.scrollTop + fullLength
          }
          if (listRef.current.scrollTop > (fullLength * 2)) {
            listRef.current.scrollTop = listRef.current.scrollTop - fullLength
          }
        }
        const scrolledIndex = Math.floor(
          (listRef.current.scrollTop + (height / 2))
          / itemHeight
        ) % options.length
        if (scrolledIndex >= 0 && scrolledIndex < options.length) {
          onChange(options[scrolledIndex].value)
        }
      }
    }
  }, [itemHeight, options, continuous, onChange])

  return (
    <div className="MIRECO-time-wheel">
      <ul ref={listRef} onScroll={handleScroll}>
        {paddingTop > 0 && (
          <li className="padding" style={{height: paddingTop}} />
        )}
        {items}
        {paddingBottom > 0 && (
          <li className="padding" style={{height: paddingBottom}} />
        )}
      </ul>
    </div>
  )
}

interface TimeSelectorProps {
  className: string
  value?: TimeInputValue
  onChange(newValue: TimeInputValue, final: boolean): void
  height?: number
  blankHour?: number
  blankMinute?: number
}

export const TimeSelector = ({
  className,
  value,
  onChange,
  height = 140,
  blankHour = 9,
  blankMinute = 0,
}: TimeSelectorProps) => {
  const hours = useMemo(() => {
    const h = Array.from(Array.from(Array(12)).keys())
    return h.map((hour) => {
      const asDate = new Date(1, 1, 1, hour)
      return {
        label: format(asDate, 'h'),
        value: hour,
      }
    })
  }, [])
  const minutes = useMemo(() => {
    const m = Array.from(Array.from(Array(60)).keys())
    return m.map((minute) => {
      const asDate = new Date(1, 1, 1, 0, minute)
      return {
        label: format(asDate, 'mm'),
        value: minute,
      }
    })
  }, [])
  const meridians = useMemo(() => {
    return [
      {
        label: 'AM',
        value: 0,
      },
      {
        label: 'PM',
        value: 1,
      },
    ]
  }, [])
  const hour = useMemo(() => {
    if (typeof value !== 'number') return undefined
    return new Date(new Date(1, 1, 1).valueOf() + value).getHours()
  }, [
    value,
  ])
  const twelveHour = useMemo(() => {
    if (typeof hour !== 'number') return undefined
    return hour % 12
  }, [hour])
  const minute = useMemo(() => {
    if (typeof value !== 'number') return undefined
    return new Date(new Date(1, 1, 1).valueOf() + value).getMinutes()
  }, [
    value,
  ])
  const meridian = useMemo(() => {
    if (typeof hour !== 'number') return undefined
    return hour >= 12 ? 1 : 0
  }, [
    hour,
  ])
  const handleHourChange = useCallback((newHour: number) => {
    onChange(
      (newHour * AN_HOUR_MS) +
      ((meridian ? 1 : 0) * 12 * AN_HOUR_MS) +
      ((typeof minute === 'number' ? minute : blankMinute) * A_MINUTE_MS),
      false
    )
  }, [
    onChange,
    meridian,
    minute,
    blankMinute,
  ])
  const handleMinuteChange = useCallback((newMinute: number) => {
    onChange(
      ((typeof hour === 'number' ? hour : blankHour) * AN_HOUR_MS) +
      (newMinute * A_MINUTE_MS),
      false
    )
  }, [
    onChange,
    hour,
    blankHour,
  ])
  const handleMeridianChange = useCallback((newMeridian: number) => {
    const current = typeof value === 'number' ? value : (
      ((typeof hour === 'number' ? hour : blankHour) * AN_HOUR_MS) +
      ((typeof minute === 'number' ? minute : blankMinute) * A_MINUTE_MS)
    )
    if (newMeridian && !meridian) {
      onChange(current + (12 * AN_HOUR_MS), false)
    } else if (!newMeridian && meridian) {
      onChange(current - (12 * AN_HOUR_MS), false)
    }
  }, [
    value,
    onChange,
    meridian,
  ])
  return (
    <div
      className={classNames('MIRECO-time-selector MIRECO-controls-popover', className)}
      style={{
        height: `${height}px`,
      }}
    >
      <Wheel
        height={height}
        options={hours}
        blank={blankHour}
        continuous
        value={twelveHour}
        onChange={handleHourChange}
      />
      <Wheel
        height={height}
        options={minutes}
        blank={blankMinute}
        continuous
        value={minute}
        onChange={handleMinuteChange}
      />
      <Wheel
        height={height}
        options={meridians}
        blank={0}
        value={meridian}
        onChange={handleMeridianChange}
      />
    </div>
  )
}
