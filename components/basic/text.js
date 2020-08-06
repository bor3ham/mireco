import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Text } from 'mireco'

function DemoText(props) {
  const [value, setValue] = useState('Example text value')
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Text
        block
        placeholder="Text value"
        value={value}
        onChange={setValue}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-text')
if (mount.length) {
  ReactDOM.render(<DemoText />, mount[0])
}
