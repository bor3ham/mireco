import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Number as NumberInput } from 'mireco'

function DemoNumber(props) {
  const [value, setValue] = useState(15)
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <NumberInput
        block
        placeholder="Number value"
        value={value}
        onChange={setValue}
        step={3}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-number')
if (mount.length) {
  ReactDOM.render(<DemoNumber />, mount[0])
}
