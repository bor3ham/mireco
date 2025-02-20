import React, { forwardRef, useState, useCallback, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import {
  getMonth,
  startOfISOWeek,
  endOfMonth,
  format,
  addWeeks,
  addDays,
  subDays,
} from 'date-fns'

import Chevron from '../vectors/chevron.svg'
import DoubleChevron from '../vectors/double-chevron.svg'
import { type DateValue, type DateInputValue, dateValueAsDate, dateAsDateValue } from 'types'

interface DayProps {
  day: DateValue
  title?: string
  month: number
  current: boolean
  selected: boolean
  firstSelected: boolean
  lastSelected: boolean
  highlight: boolean
  firstHighlight: boolean
  lastHighlight: boolean
  invalidReason?: string
  today: DateInputValue
  onMouseEnter(): void
  onMouseLeave(): void
  select?(day: DateValue): void
}

const Day: React.FC<DayProps> = ({
  day,
  title,
  month,
  current,
  selected,
  firstSelected,
  lastSelected,
  highlight,
  firstHighlight,
  lastHighlight,
  invalidReason,
  today,
  onMouseEnter,
  onMouseLeave,
  select,
}) => {
  const parsedDay = dateValueAsDate(day)
  const valid = !invalidReason
  return (
    <td
      title={title}
      className={classNames({
        'outside-month': getMonth(parsedDay) !== month,
        current,
        selected,
        'first-selected': firstSelected,
        'last-selected': lastSelected,
        highlight,
        'first-highlight': firstHighlight,
        'last-highlight': lastHighlight,
        'invalid': !valid,
        today: day === today,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          if (select && valid) {
            select(day)
          }
        }}
        disabled={!valid}
      >
        {format(parsedDay, 'd')}
      </button>
    </td>
  )
}

export interface DayCalendarProps {
  selectDay?(day: DateValue): void
  value?: DateInputValue
  selected?(day: DateValue): boolean
  highlight?(day: DateValue, hovered: DateValue | undefined): boolean
  invalid?(day: DateValue): string | undefined
  className?: string
}

export const DayCalendar = forwardRef<HTMLDivElement, DayCalendarProps>(({
  selectDay,
  value,
  selected = () => false,
  highlight = () => false,
  invalid = () => undefined,
  className,
}, ref) => {
  const initial = value ? dateValueAsDate(value) : new Date()
  const [month, setMonth] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })
  const prevMonth = useCallback(() => {
    setMonth((prev) => {
      let newMonth = prev.month - 1
      let newYear = prev.year
      if (newMonth < 0) {
        newYear -= 1
        newMonth = 11
      }
      return {
        month: newMonth,
        year: newYear,
      }
    })
  }, [])
  const nextMonth = useCallback(() => {
    setMonth((prev) => {
      let newMonth = prev.month + 1
      let newYear = prev.year
      if (newMonth > 11) {
        newYear += 1
        newMonth = 0
      }
      return {
        month: newMonth,
        year: newYear,
      }
    })
  }, [])
  const prevYear = useCallback(() => {
    setMonth((prev) => ({
      month: prev.month,
      year: prev.year - 1,
    }))
  }, [])
  const nextYear = useCallback(() => {
    setMonth((prev) => ({
      month: prev.month,
      year: prev.year + 1,
    }))
  }, [])

  useEffect(() => {
    if (typeof value === 'string') {
      const parsed = dateValueAsDate(value)
      setMonth({
        year: parsed.getFullYear(),
        month: parsed.getMonth(),
      })
    }
  }, [
    value,
  ])

  const today = dateAsDateValue(new Date())

  const [hoveredDay, setHoveredDay] = useState<DateValue | undefined>(undefined)

  const table = useMemo(() => {
    const weeks: string[][] = []
    const firstDay = startOfISOWeek(new Date(month.year, month.month))
    const lastDay = endOfMonth(new Date(month.year, month.month))
    let day = firstDay
    while (+day < +lastDay) {
      const newWeek: string[] = []
      for (let i = 0; i < 7; i++) {
        newWeek.push(dateAsDateValue(addDays(day, i)))
      }
      weeks.push(newWeek)
      day = addWeeks(day, 1)
    }

    return (
      <table>
        <tbody>
          <tr>
            {weeks[0].map((weekDay) => {
              const parsedDay = dateValueAsDate(weekDay)
              return (
                <th key={`header-${weekDay}`}>
                  {format(parsedDay, 'EEEEEE')}
                </th>
              )
            })}
          </tr>
          {weeks.map((week) => (
            <tr key={`week-${week[0]}`}>
              {week.map((dayInWeek, weekIndex) => {
                const invalidReason = invalid(dayInWeek)
                let title = dayInWeek == today ? 'Today' : ''
                if (invalidReason) {
                  title += `\n\n${invalidReason}`
                }
                const daySelected = selected && selected(dayInWeek)
                let firstSelected = false
                let lastSelected = false
                const dayHighlight = highlight && highlight(dayInWeek, hoveredDay)
                let firstHighlight = false
                let lastHighlight = false
                if (daySelected || dayHighlight) {
                  const prevDayInWeek = dateAsDateValue(subDays(dateValueAsDate(dayInWeek), 1))
                  const nextDayInWeek = dateAsDateValue(addDays(dateValueAsDate(dayInWeek), 1))
                  if (daySelected) {
                    firstSelected = !selected(prevDayInWeek)
                    lastSelected = !selected(nextDayInWeek)
                  }
                  if (dayHighlight) {
                    firstHighlight = !highlight(prevDayInWeek, hoveredDay)
                    lastHighlight = !highlight(nextDayInWeek, hoveredDay)
                  }
                }
                return (
                  <Day
                    key={`day-${dayInWeek}`}
                    day={dayInWeek}
                    title={title.trim()}
                    month={month.month}
                    current={dayInWeek === value}
                    selected={daySelected}
                    firstSelected={firstSelected}
                    lastSelected={lastSelected}
                    highlight={dayHighlight}
                    firstHighlight={firstHighlight}
                    lastHighlight={lastHighlight}
                    invalidReason={invalidReason}
                    today={today}
                    onMouseEnter={() => {
                      setHoveredDay(dayInWeek)
                    }}
                    onMouseLeave={() => {
                      setHoveredDay(undefined)
                    }}
                    select={selectDay}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }, [month, selectDay, selected, highlight, value, today, invalid, hoveredDay])

  return (
    <div className={classNames('MIRECO-day-calendar MIRECO-controls-popover', className)} ref={ref}>
      <div className="calendar-header">
        <button type="button" tabIndex={-1} onClick={prevYear} title="Previous Year">
          <DoubleChevron className="MIRECO-double-chevron MIRECO-double-chevron-left" />
        </button>
        <button type="button" tabIndex={-1} onClick={prevMonth} title="Previous Month">
          <Chevron className="MIRECO-chevron MIRECO-chevron-left" />
        </button>
        <h5>{format(new Date(month.year, month.month), 'MMMM yyyy')}</h5>
        <button type="button" tabIndex={-1} onClick={nextMonth} title="Next Month">
          <Chevron className="MIRECO-chevron MIRECO-chevron-right" />
        </button>
        <button type="button" tabIndex={-1} onClick={nextYear} title="Next Year">
          <DoubleChevron className="MIRECO-double-chevron MIRECO-double-chevron-right" />
        </button>
      </div>
      {table}
    </div>
  )
})
