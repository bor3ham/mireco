import React, { forwardRef, useState, useCallback, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import classNames from 'classnames'

import type { MonthInputValue, CalendarMonthValue } from 'types'
import { dateAsMonth, monthAsDate, isMonthValue } from 'types'
import { ChevronRightVector, ChevronLeftVector } from 'vectors'

export interface MonthCalendarProps {
  current?: MonthInputValue
  onSelect?(month: CalendarMonthValue, year: number): void
  showYears?: boolean
}

export const MonthCalendar = forwardRef<HTMLDivElement, MonthCalendarProps>(({
  current,
  onSelect,
  showYears,
}, ref) => {
  const [year, setYear] = useState<number>((new Date()).getFullYear())
  const prevYear = useCallback(() => {
    setYear((prev) => (prev - 1))
  }, [])
  const nextYear = useCallback(() => {
    setYear((prev) => (prev + 1))
  }, [])
  useEffect(() => {
    if (isMonthValue(current)) {
      const asDate = monthAsDate(current!)
      setYear(asDate.getFullYear())
    }
  }, [
    current,
  ])

  const months = useMemo(() => {
    const now = new Date()
    const m = []
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const asDate = new Date(year, monthIndex)
      const month = dateAsMonth(asDate)
      m.push(
        <li key={`month-${monthIndex}`} className={classNames({
          current: current === month,
        })}>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              if (onSelect) {
                onSelect(monthIndex, year)
              }
            }}
          >
            {format(new Date(now.getFullYear(), monthIndex), 'MMM')}
          </button>
        </li>
      )
    }
    return m
  }, [
    current,
    year,
    onSelect,
  ])
  return (
    <div className="MIRECO-month-calendar" ref={ref}>
      {showYears && (
        <div className="calendar-header">
          <h5>{year}</h5>
          <button type="button" tabIndex={-1} onClick={prevYear}>
            <ChevronLeftVector />
          </button>
          <button type="button" tabIndex={-1} onClick={nextYear}>
            <ChevronRightVector />
          </button>
        </div>
      )}
      <ol className="months">
        {months}
      </ol>
    </div>
  )
})
