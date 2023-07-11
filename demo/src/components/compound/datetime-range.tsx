import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { DatetimeRange } from 'mireco'
import type { DatetimeRangeInputValue, DatetimeValue } from 'mireco'

function stringifyDate(date: DatetimeValue) {
  if (typeof date === 'number') {
    return JSON.stringify(new Date(date))
  }
  if (typeof date === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(date)
}

function stringifyValue(value: DatetimeRangeInputValue) {
  if (value) {
    return JSON.stringify({
      start: stringifyDate(value.start),
      end: stringifyDate(value.end),
    })
  }
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(value)
}

const DemoDatetimeRange = () => {
  const [value, setValue] = useState<DatetimeRangeInputValue>(null)
  const handleChange = useCallback((newValue: DatetimeRangeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyValue(value)}</p>
      <DatetimeRange
        value={value}
        onChange={handleChange}
        block
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-datetime-range')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDatetimeRange />)
}
