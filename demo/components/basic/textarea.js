import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Textarea } from 'mireco'

function DemoTextarea(props) {
  const [value, setValue] = useState('Example text value...\nWith multiple lines.')
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Textarea
        block
        placeholder="Textarea value"
        value={value}
        onChange={setValue}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-textarea')
if (mount.length) {
  ReactDOM.render(<DemoTextarea />, mount[0])
}
