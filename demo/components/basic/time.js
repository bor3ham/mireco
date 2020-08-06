import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Time } from 'mireco'

function stringifyTime(time) {
  if (typeof time === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(time)
}

function DemoTime(props) {
  const [value, setValue] = useState(null)
  return (
    <>
      <p>Field value: {stringifyTime(value)}</p>
      <Time
        block
        value={value}
        onChange={setValue}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-time')
if (mount.length) {
  ReactDOM.render(<DemoTime />, mount[0])
}
