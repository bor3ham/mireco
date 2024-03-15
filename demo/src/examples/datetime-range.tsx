import React, { useState, useCallback } from 'react'
import { DatetimeRange, type DatetimeRangeInputValue, type DatetimeInputValue } from 'mireco'

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
