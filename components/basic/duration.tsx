import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Duration } from 'mireco/inputs'

function DemoDuration(props) {
  const [value, setValue] = useState(null)
  return (
    <>
      <p>Field value: {typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)}</p>
      <Duration
        block
        placeholder="Duration"
        value={value}
        onChange={(newValue, wasBlur) => setValue(newValue)}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-duration')
if (mount.length) {
  ReactDOM.render(<DemoDuration />, mount[0])
}
