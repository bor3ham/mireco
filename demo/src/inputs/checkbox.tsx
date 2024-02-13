import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Checkbox } from 'mireco'

const DemoCheckbox = () => {
  const [value, setValue] = useState(false)
  const handleChange = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Checked: {value ? 'Yes' : 'No'}</p>
      <Checkbox value={value} onChange={handleChange}>
        Confirm choice
      </Checkbox>
    </>
  )
}

const container = document.querySelector('div.demo-mount-checkbox')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoCheckbox />)
}
