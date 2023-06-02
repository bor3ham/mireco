import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Duration } from 'mireco'
import type { DurationValue } from 'mireco'

const DemoDuration = () => {
  const [value, setValue] = useState<DurationValue>(null)
  const handleChange = useCallback((newValue: DurationValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)}</p>
      <Duration
        value={value}
        onChange={handleChange}
        placeholder="Enter a duration"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-duration')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDuration />)
}
