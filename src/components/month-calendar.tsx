import React, { useMemo } from 'react'
import { format } from 'date-fns'
import classNames from 'classnames'

import type { CalendarMonthInputValue, CalendarMonthValue } from 'types'

interface MonthCalendarProps {
  current?: CalendarMonthInputValue
  onSelect?(newValue: CalendarMonthValue): void
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  current,
  onSelect,
}) => {
  const months = useMemo(() => {
    const now = new Date()
    const m = []
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      m.push(
        <li key={`month-${monthIndex}`} className={classNames({
          current: current === monthIndex,
        })}>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              if (onSelect) {
                onSelect(monthIndex)
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
    onSelect,
  ])
  return (
    <div className="MIRECO-month-calendar">
      <ol className="months">
        {months}
      </ol>
    </div>
  )
}
