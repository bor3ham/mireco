import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { DatetimeRange } from 'mireco'

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

function DemoDatetimeRange(props) {
  const [value, setValue] = useState(null)
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  return (
    <>
      <p>Field value: {stringifyValue(value)}</p>
      <DatetimeRange
        block
        value={value}
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-datetime-range')
if (mount.length) {
  ReactDOM.render(<DemoDatetimeRange />, mount[0])
}
