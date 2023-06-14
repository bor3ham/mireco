import React, { forwardRef, useState, useCallback, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import {
  getMonth,
  startOfISOWeek,
  endOfMonth,
  format,
  addWeeks,
  addDays,
  parse,
} from 'date-fns'

import { ISO_8601_DATE_FORMAT } from 'constants'
import { ArrowRightVector, ArrowLeftVector } from 'vectors'
import type { DateValue, DateInputValue } from 'types'

export interface DayCalendarProps {
  selectDay?(day: DateValue): void
  current?: DateInputValue
  showCurrent?: boolean
  highlight?(day: DateValue): void
}

export const DayCalendar = forwardRef<HTMLDivElement, DayCalendarProps>(({
  selectDay,
  current,
  showCurrent = true,
  highlight = (calendarDay: DateValue, today: DateValue) => (calendarDay === today),
}, ref) => {
  const initial = current ? parse(current, ISO_8601_DATE_FORMAT, new Date()) : new Date()
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

  useEffect(() => {
    if (typeof current === 'string') {
      const parsed = parse(current, ISO_8601_DATE_FORMAT, new Date())
      setMonth({
        year: parsed.getFullYear(),
        month: parsed.getMonth(),
      })
    }
  }, [
    current,
  ])

  const today = format(new Date(), ISO_8601_DATE_FORMAT)

  const table = useMemo(() => {
    const weeks: string[][] = []
    const firstDay = startOfISOWeek(new Date(month.year, month.month))
    const lastDay = endOfMonth(new Date(month.year, month.month))
    let day = firstDay
    while (+day < +lastDay) {
      const newWeek: string[] = []
      for (let i = 0; i < 7; i++) {
        newWeek.push(format(addDays(day, i), ISO_8601_DATE_FORMAT))
      }
      weeks.push(newWeek)
      day = addWeeks(day, 1)
    }

    return (
      <table>
        <tbody>
          <tr>
            {weeks[0].map((weekDay) => {
              const parsedDay = parse(weekDay, ISO_8601_DATE_FORMAT, new Date())
              return (
                <th key={`header-${weekDay}`}>
                  {format(parsedDay, 'EEEEEE')}
                </th>
              )
            })}
          </tr>
          {weeks.map((week) => (
            <tr key={`week-${week[0]}`}>
              {week.map((dayInWeek) => {
                const parsedDay = parse(dayInWeek, ISO_8601_DATE_FORMAT, new Date())
                return (
                  <td key={`day-${dayInWeek}`} className={classNames({
                    'outside-month': getMonth(parsedDay) !== month.month,
                    'current': showCurrent && (current === dayInWeek),
                    'highlight': (
                      highlight && highlight(dayInWeek, today)
                    ),
                  })}>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        if (selectDay) {
                          selectDay(dayInWeek)
                        }
                      }}
                    >
                      {format(parsedDay, 'd')}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }, [month, selectDay, showCurrent, highlight, current, today])

  return (
    <div className="MIRECO-day-calendar" ref={ref}>
      <div className="calendar-header">
        <h5>{format(new Date(month.year, month.month), 'MMMM yyyy')}</h5>
        <button type="button" tabIndex={-1} onClick={prevMonth}>
          <ArrowLeftVector />
        </button>
        <button type="button" tabIndex={-1} onClick={nextMonth}>
          <ArrowRightVector />
        </button>
      </div>
      {table}
    </div>
  )
})
