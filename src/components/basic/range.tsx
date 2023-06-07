import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Range } from 'mireco'
import type { RangeInputValue } from 'mireco'

const DemoRange = () => {
  const [value, setValue] = useState<RangeInputValue>(1)
  const handleChange = useCallback((newValue: RangeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {value}</p>
      <Range
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
