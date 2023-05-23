import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Datetime } from 'mireco/inputs'

function stringifyDate(date) {
  if (typeof date === 'number') {
    return JSON.stringify(new Date(date))
  }
  if (typeof date === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(date)
}

const DemoDatetime = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyDate(value)}</p>
      <Datetime
        block
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-datetime')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDatetime />)
}
