import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Datetime } from 'mireco/inputs'

function stringifyDate(date) {
  if (typeof date === 'number') {
    return JSON.stringify(new Date(date))
  }
  if (typeof date === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(date)
}

function DemoDatetime(props) {
  const [value, setValue] = useState(null)
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  return (
    <>
      <p>Field value: {stringifyDate(value)}</p>
      <Datetime
        block
        value={value}
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-datetime')
if (mount.length) {
  ReactDOM.render(<DemoDatetime />, mount[0])
}
