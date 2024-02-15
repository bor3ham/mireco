import React, { useState, useCallback } from 'react'
import { Range, type RangeInputValue } from 'mireco'

export const RangeExample = () => {
  const [value, setValue] = useState<RangeInputValue>(1)
  const handleChange = useCallback((newValue: RangeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {value}</code></p>
      <Range
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
