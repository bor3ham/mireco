import React, { useState, useCallback } from 'react'
import { Month, type MonthInputValue } from 'mireco'

const stringifyValue = (value: MonthInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const MonthExample = () => {
  const [value, setValue] = useState<MonthInputValue>(null)
  const handleChange = useCallback((newValue: MonthInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <Month
        value={value}
        onChange={handleChange}
        placeholder="Select month"
      />
    </>
  )
}
