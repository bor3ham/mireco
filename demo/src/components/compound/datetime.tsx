import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Datetime } from 'mireco'
import type { DatetimeInputValue } from 'mireco'

function stringifyDate(date: DatetimeInputValue) {
  if (typeof date === 'number') {
    return JSON.stringify(new Date(date))
  }
  if (typeof date === 'undefined') {
    return 'undefined'
  }
  return JSON.stringify(date)
}

const DemoDatetime = () => {
  const [value, setValue] = useState<DatetimeInputValue>(null)
  const handleChange = useCallback((newValue: DatetimeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {stringifyDate(value)}</p>
      <Datetime
        value={value}
        onChange={handleChange}
        block
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-datetime')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDatetime />)
}
