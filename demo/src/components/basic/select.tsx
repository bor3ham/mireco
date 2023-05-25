import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Select } from 'mireco'

const NULLABLE = true
const OPTIONS = [
  {
    value: 'bike',
    label: 'Bicycle',
  },
  {
    value: 'cyclone',
    label: 'Cyclone',
  },
  {
    value: 'wash_cycle',
    label: 'Wash Cycle',
  },
  {
    value: 'binoculars',
    label: 'Binoculars',
  },
]

const DemoSelect = () => {
  const [value, setValue] = useState(NULLABLE ? null : OPTIONS[0].value)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <Select
        block
        placeholder="Select value"
        value={value}
        options={OPTIONS}
        onChange={handleChange}
        nullable={NULLABLE}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-select')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoSelect />)
}
