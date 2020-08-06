import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Datetime } from 'mireco'

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
  return (
    <>
      <p>Field value: {stringifyDate(value)}</p>
      <Datetime
        block
        value={value}
        onChange={setValue}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-datetime')
if (mount.length) {
  ReactDOM.render(<DemoDatetime />, mount[0])
}
