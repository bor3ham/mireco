import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { DatetimeRange } from 'mireco/inputs'

function stringifyDate(date) {
  if (typeof date === 'number') {
    return JSON.stringify(new Date(date))
  }
  if (typeof date === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(date)
}

function stringifyValue(value) {
  if (value) {
    return JSON.stringify({
      start: stringifyDate(value.start),
      end: stringifyDate(value.end),
    })
  }
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(value)
}

const DemoDatetimeRange = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyValue(value)}</p>
      <DatetimeRange
        block
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-datetime-range')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDatetimeRange />)
}
