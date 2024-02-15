import React, { useState, useCallback } from 'react'
import { DatetimeRange, type DatetimeRangeInputValue, type DatetimeValue } from 'mireco'

function stringifyDate(value: DatetimeValue) {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

function stringifyValue(value: DatetimeRangeInputValue) {
  if (typeof value === 'undefined') return 'undefined' // temp until this is changed
  if (value === null) return 'null' // temp until this is changed
  return `{
    start: ${stringifyDate(value.start)},
    end: ${stringifyDate(value.end)}
  }`
}

export const DatetimeRangeExample = () => {
  const [value, setValue] = useState<DatetimeRangeInputValue>(null)
  const handleChange = useCallback((newValue: DatetimeRangeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <DatetimeRange
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
