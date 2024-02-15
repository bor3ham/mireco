import React, { useState, useCallback } from 'react'
import { Number as NumberInput, type NumberInputValue } from 'mireco'

const stringifyValue = (value: NumberInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const NumberExample = () => {
  const [value, setValue] = useState<NumberInputValue>(null)
  const handleChange = useCallback((newValue: NumberInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <NumberInput
        value={value}
        onChange={handleChange}
        placeholder="Enter number"
      />
    </>
  )
}
