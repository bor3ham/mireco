import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { CalendarMonth, formatCalendarMonth, isCalendarMonthValue } from 'mireco'
import type { CalendarMonthInputValue } from 'mireco'

const displayCalendarMonth = (value: CalendarMonthInputValue) => {
  if (isCalendarMonthValue(value)) {
    return formatCalendarMonth(value, 'MMMM')
  }
  return JSON.stringify(value) || 'undefined'
}

const DemoCalendarMonth = () => {
  const [value, setValue] = useState<CalendarMonthInputValue>(null)
  const handleChange = useCallback((newValue: CalendarMonthInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Month: {displayCalendarMonth(value)}</p>
      <CalendarMonth
        value={value}
        onChange={handleChange}
        placeholder="Enter a month"
        clearable
        block
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-calendar-month')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoCalendarMonth />)
}
