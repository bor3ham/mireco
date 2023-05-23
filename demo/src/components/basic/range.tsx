import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Range } from 'mireco/inputs'

const DemoRange = () => {
  const [value, setValue] = useState(1)
  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {value}</p>
      <Range
        block
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-range')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoRange />)
}
