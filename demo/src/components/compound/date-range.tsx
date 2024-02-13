import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { DateRange } from 'mireco'
import type { DateRangeInputValue, DateInputValue } from 'mireco'

function stringifyValue(value: DateInputValue) {
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  return value
}

const DemoDateRange = () => {
  const [value, setValue] = useState<DateRangeInputValue>({
    start: null,
    end: null,
  })
  const handleChange = useCallback((newValue: DateRangeInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {'{\n'}
        {'"start": '}{JSON.stringify(value.start) || 'undefined'}{',\n'}
        {'"end": '}{JSON.stringify(value.end) || 'undefined'}{'\n'}
      {'}'}</p>
      <DateRange
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-date-range')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoDateRange />)
}
