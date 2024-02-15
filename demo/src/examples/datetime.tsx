import React, { useState, useCallback } from 'react'
import { Datetime, type DatetimeInputValue } from 'mireco'

function stringifyValue(value: DatetimeInputValue) {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const DatetimeExample = () => {
  const [value, setValue] = useState<DatetimeInputValue>(null)
  const handleChange = useCallback((newValue: DatetimeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <Datetime
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
