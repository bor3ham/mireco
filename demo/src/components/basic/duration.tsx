import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Duration } from 'mireco'

const DemoDuration = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)}</p>
      <Duration
        block
        placeholder="Duration"
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-duration')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDuration />)
}
