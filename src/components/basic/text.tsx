import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Text } from 'mireco'

const DemoText = () => {
  const [value, setValue] = useState('')
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Text
        value={value}
        onChange={handleChange}
        placeholder="Enter text"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-text')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoText />)
}
