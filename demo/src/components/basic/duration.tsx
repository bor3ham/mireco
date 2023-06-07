import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Duration } from 'mireco'
import type { DurationInputValue } from 'mireco'

const DemoDuration = () => {
  const [value, setValue] = useState<DurationInputValue>(null)
  const handleChange = useCallback((newValue: DurationInputValue, wasBlur: boolean) => {
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