import React, { useState, useCallback } from 'react'
import { ToggleSelect, type SelectValue } from 'mireco'

const OPTIONS = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'tomorrow',
    label: 'Tomorrow',
  },
]

const stringifyValue = (value: SelectValue) => {
  return JSON.stringify(value)
}

export const ToggleSelectExample = () => {
  const [value, setValue] = useState<SelectValue>(OPTIONS[0].value)
  const handleChange = useCallback((newValue: SelectValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <ToggleSelect
        value={value}
        onChange={handleChange}
        options={OPTIONS}
      />
    </>
  )
}
