import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Date as DateInput } from 'mireco/inputs'

const DemoDate = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <DateInput
        block
        placeholder="Date value"
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-date')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDate />)
}
