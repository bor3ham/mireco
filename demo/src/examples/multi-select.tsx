import React, { useState, useCallback } from 'react'
import { MultiSelect, type SelectValue } from 'mireco'

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
    label: 'Binoculars with Nightvision',
  },
]

const stringifyValue = (value: SelectValue[]) => {
  return JSON.stringify(value)
}

export const MultiSelectExample = () => {
  const [value, setValue] = useState<SelectValue[]>([])
  const handleValueChange = useCallback((newValue: SelectValue[], wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <MultiSelect
        value={value}
        onChange={handleValueChange}
        options={OPTIONS}
        placeholder="Select from values"
      />
    </>
  )
}
