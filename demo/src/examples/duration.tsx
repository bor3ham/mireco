import React, { useState, useCallback } from 'react'
import { Duration, type DurationInputValue } from 'mireco'

const stringifyValue = (value: DurationInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const DurationExample = () => {
  const [value, setValue] = useState<DurationInputValue>(null)
  const handleChange = useCallback((newValue: DurationInputValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <Duration
        value={value}
        onChange={handleChange}
        placeholder="Enter a duration"
      />
    </>
  )
}
