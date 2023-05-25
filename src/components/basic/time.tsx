import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Time } from 'mireco'

function stringifyTime(time) {
  if (typeof time === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(time)
}

const DemoTime = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyTime(value)}</p>
      <Time
        block
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-time')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoTime />)
}
