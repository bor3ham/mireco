import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Text } from 'mireco'

const DemoText = () => {
  const [value, setValue] = useState('Example text value')
  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Text
        block
        placeholder="Text value"
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-text')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoText />)
}
