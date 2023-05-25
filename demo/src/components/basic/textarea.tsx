import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Textarea } from 'mireco'

const DemoTextarea = () => {
  const [value, setValue] = useState('Example text value...\nWith multiple lines.')
  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Textarea
        block
        placeholder="Textarea value"
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-textarea')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoTextarea />)
}
