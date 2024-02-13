import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Textarea } from 'mireco'

const DemoTextarea = () => {
  const [value, setValue] = useState<string>('')
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value)}</p>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter multiple lines of text"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-textarea')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoTextarea />)
}
