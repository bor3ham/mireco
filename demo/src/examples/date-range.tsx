import React, { useState, useCallback, useMemo } from 'react'
import { DateRange, type DateRangeInputValue, type DateInputValue, dateAsDateValue } from 'mireco'
import { startOfWeek, addDays, startOfMonth, endOfMonth, startOfDay } from 'date-fns'

function stringifyDate(value: DateInputValue) {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

function stringifyValue(value: DateRangeInputValue) {
  return `{
    start: ${stringifyDate(value.start)},
    end: ${stringifyDate(value.end)}
  }`
}

export const DateRangeExample = () => {
  const [value, setValue] = useState<DateRangeInputValue>({
    start: null,
    end: null,
  })
  const handleChange = useCallback((newValue: DateRangeInputValue) => {
    setValue(newValue)
  }, [])
  const shortcuts = useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const monthStart = startOfMonth(today)
    const nextMonthStart = startOfDay(addDays(endOfMonth(monthStart), 1))
    const s = []
    s.push({
      label: 'This week',
      key: 'this_week',
      value: {
        start: dateAsDateValue(weekStart),
        end: dateAsDateValue(addDays(weekStart, 6)),
      },
    })
    s.push({
      label: 'Next week',
      key: 'next_week',
      value: {
        start: dateAsDateValue(addDays(weekStart, 7)),
        end: dateAsDateValue(addDays(weekStart, 13)),
      },
    })
    s.push({
      label: 'This month',
      key: 'this_month',
      value: {
        start: dateAsDateValue(monthStart),
        end: dateAsDateValue(endOfMonth(monthStart)),
      },
    })
    s.push({
      label: 'Next month',
      key: 'next_month',
      value: {
        start: dateAsDateValue(nextMonthStart),
        end: dateAsDateValue(endOfMonth(nextMonthStart)),
      },
    })
    return s
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <DateRange
        value={value}
        onChange={handleChange}
        shortcuts={shortcuts}
      />
    </>
  )
}
