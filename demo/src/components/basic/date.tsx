import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Date as DateInput } from 'mireco'
import type { DateInputValue } from 'mireco'

const DemoDate = () => {
  const [value, setValue] = useState<DateInputValue>(null)
  const handleChange = useCallback((newValue: DateInputValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <DateInput
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