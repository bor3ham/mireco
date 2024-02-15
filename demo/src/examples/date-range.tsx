import React, { useState, useCallback } from 'react'
import { DateRange, type DateRangeInputValue, type DateInputValue } from 'mireco'

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
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <DateRange
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
