import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Number as NumberInput } from 'mireco/inputs'

function DemoNumber(props) {
  const [value, setValue] = useState(5)
  const stringified = typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)
  return (
    <>
      <p>Field value: {stringified}</p>
      <NumberInput
        block
        placeholder="Number value"
        value={value}
        onChange={setValue}
        step={5}
        min={-7}
        max={12}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-number')
if (mount.length) {
  ReactDOM.render(<DemoNumber />, mount[0])
}
