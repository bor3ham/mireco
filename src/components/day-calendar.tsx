import React, { useState, useCallback, useEffect, useMemo } from 'react'
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

interface Props {
  selectDay?(day: DateValue): void
  current?: DateInputValue
  showCurrent?: boolean
  highlight?(day: DateValue): void
}

export const DayCalendar: React.FC<Props> = ({
  selectDay,
  current,
  showCurrent = true,
  highlight = (calendarDay: DateValue, today: DateValue) => (calendarDay === today),
}) => {
  const initial = current ? parse(current, ISO_8601_DATE_FORMAT, new Date()) : new Date()
  const [month, setMonth] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })
  const prevMonth = useCallback(() => {
    setMonth((prev) => {
      let month = prev.month - 1
      let year = prev.year
      if (month < 0) {
        year -= 1
        month = 11
      }
      return {
        month,
        year,
      }
    })
  }, [])
  const nextMonth = useCallback(() => {
    setMonth((prev) => {
      let month = prev.month + 1
      let year = prev.year
      if (month > 11) {
        year += 1
        month = 0
      }
      return {
        month,
        year,
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

  const handleDaySelected = useCallback((day: string) => {
    if (selectDay) {
      selectDay(day)
    }
  }, [selectDay])

  let today = format(new Date(), ISO_8601_DATE_FORMAT)

  const table = useMemo(() => {
    const weeks: string[][] = []
    const firstDay = startOfISOWeek(new Date(month.year, month.month))
    const lastDay = endOfMonth(new Date(month.year, month.month))
    let day = firstDay
    while (+day < +lastDay) {
      const newWeek: string[] = []
      for (var i = 0; i < 7; i++) {
        newWeek.push(format(addDays(day, i), ISO_8601_DATE_FORMAT))
      }
      weeks.push(newWeek)
      day = addWeeks(day, 1)
    }

    return (
      <table>
        <tbody>
          <tr>
            {weeks[0].map((day, dayIndex) => {
              const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
              return (
                <th key={`header-${dayIndex}`}>
                  {format(parsedDay, 'EEEEEE')}
                </th>
              )
            })}
          </tr>
          {weeks.map((week, weekIndex) => {
            return (
              <tr key={`week-${weekIndex}`}>
                {week.map((day, dayIndex) => {
                  const parsedDay = parse(day, ISO_8601_DATE_FORMAT, new Date())
                  return (
                    <td key={`day-${dayIndex}`} className={classNames({
                      'outside-month': getMonth(parsedDay) != month.month,
                      'current': showCurrent && (current === day),
                      'highlight': (
                        highlight && highlight(day, today)
                      ),
                    })}>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => {
                          if (selectDay) {
                            selectDay(day)
                          }
                        }}
                      >
                        {format(parsedDay, 'd')}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }, [month, selectDay, showCurrent, highlight])

  return (
    <div className="MIRECO-day-calendar">
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
}
