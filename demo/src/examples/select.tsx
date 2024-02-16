import React, { useState, useCallback } from 'react'
import { Select, type SelectInputValue } from 'mireco'

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

const stringifyValue = (value: SelectInputValue) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

export const SelectExample = () => {
  const [value, setValue] = useState<SelectInputValue>(null)
  const handleChange = useCallback((newValue: SelectInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <Select
        value={value}
        onChange={handleChange}
        options={OPTIONS}
        placeholder="Select a value"
      />
    </>
  )
}
