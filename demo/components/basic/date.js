import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Date as DateInput } from 'mireco'

function DemoDate(props) {
  const [value, setValue] = useState(null)
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <DateInput
        block
        placeholder="Date value"
        value={value}
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-date')
if (mount.length) {
  ReactDOM.render(<DemoDate />, mount[0])
}
