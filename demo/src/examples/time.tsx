import React, { useState, useCallback } from 'react'
import { Time, type TimeInputValue } from 'mireco'

function stringifyTime(time: TimeInputValue) {
  if (typeof time === 'undefined') return 'undefined'
  return JSON.stringify(time)
}

export const TimeExample = () => {
  const [value, setValue] = useState<TimeInputValue>(null)
  const handleChange = useCallback((newValue: TimeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyTime(value)}</code></p>
      <Time
        value={value}
        onChange={handleChange}
      />
    </>
  )
}
