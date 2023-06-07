import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Time } from 'mireco'
import type { TimeInputValue } from 'mireco'

function stringifyTime(time: TimeInputValue) {
  if (typeof time === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(time)
}

const DemoTime = () => {
  const [value, setValue] = useState<TimeInputValue>(null)
  const handleChange = useCallback((newValue: TimeInputValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyTime(value)}</p>
      <Time
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
