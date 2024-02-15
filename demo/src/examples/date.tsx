import React, { useState, useCallback } from 'react'
import { Date as DateInput, type DateInputValue } from 'mireco'

const stringifyValue = (value: DateInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const DateExample = () => {
  const [value, setValue] = useState<DateInputValue>(null)
  const handleChange = useCallback((newValue: DateInputValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <DateInput
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
