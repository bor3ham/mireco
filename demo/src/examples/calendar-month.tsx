import React, { useState, useCallback } from 'react'
import { CalendarMonth, formatCalendarMonth, isCalendarMonthValue, type CalendarMonthInputValue } from 'mireco'

const stringifyValue = (value: CalendarMonthInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const CalendarMonthExample = () => {
  const [value, setValue] = useState<CalendarMonthInputValue>(null)
  const handleChange = useCallback((newValue: CalendarMonthInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <CalendarMonth
        value={value}
        onChange={handleChange}
        placeholder="Select calendar month"
      />
    </>
  )
}
