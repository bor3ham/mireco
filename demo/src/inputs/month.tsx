import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Month, isMonthValue } from 'mireco'
import type { MonthInputValue } from 'mireco'

const displayMonth = (value: MonthInputValue) => {
  if (isMonthValue(value)) {
    return value
  }
  return JSON.stringify(value) || 'undefined'
}

const DemoCalendarMonth = () => {
  const [value, setValue] = useState<MonthInputValue>(null)
  const handleChange = useCallback((newValue: MonthInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Month: {displayMonth(value)}</p>
      <Month
        value={value}
        onChange={handleChange}
        placeholder="Select month"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-month')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoCalendarMonth />)
}
