import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Range } from 'mireco'

function DemoRange(props) {
  const [value, setValue] = useState(1)
  return (
    <>
      <p>Field value: {value}</p>
      <Range
        block
        value={value}
        onChange={setValue}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-range')
if (mount.length) {
  ReactDOM.render(<DemoRange />, mount[0])
}
