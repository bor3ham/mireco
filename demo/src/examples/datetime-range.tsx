import React, { useState, useCallback, useMemo } from 'react'
import { DatetimeRange, type DatetimeRangeInputValue, type DatetimeInputValue, dateAsDateValue } from 'mireco'
import { startOfWeek, addDays, addHours, startOfDay } from 'date-fns'

function stringifyDate(value: DatetimeInputValue) {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

function stringifyValue(value: DatetimeRangeInputValue) {
  return `{
    start: ${stringifyDate(value.start)},
    end: ${stringifyDate(value.end)}
  }`
}

export const DatetimeRangeExample = () => {
  const [value, setValue] = useState<DatetimeRangeInputValue>({
    start: null,
    end: null,
  })
  const handleChange = useCallback((newValue: DatetimeRangeInputValue) => {
    setValue(newValue)
  }, [])
  const shortcuts = useMemo(() => {
    const todayStart = startOfDay(new Date())
    const weekStart = startOfWeek(todayStart, { weekStartsOn: 1 })
    const s = []
    s.push({
      label: 'This week',
      key: 'this_week',
      value: {
        start: weekStart.valueOf(),
        end: addDays(weekStart, 7).valueOf(),
      },
    })
    s.push({
      label: 'Next week',
      key: 'next_week',
      value: {
        start: addDays(weekStart, 7).valueOf(),
        end: addDays(weekStart, 14).valueOf(),
      },
    })
    s.push({
      label: 'Today workday',
      key: 'today_workday',
      value: {
        start: addHours(todayStart, 9).valueOf(),
        end: addHours(todayStart, 17).valueOf(),
      },
    })
    s.push({
      label: 'Tomorrow workday',
      key: 'tomorrow_workday',
      value: {
        start: addHours(addDays(todayStart, 1), 9).valueOf(),
        end: addHours(addDays(todayStart, 1), 17).valueOf(),
      },
    })
    return s
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <DatetimeRange
        value={value}
        onChange={handleChange}
        shortcuts={shortcuts}
      />
    </>
  )
}
