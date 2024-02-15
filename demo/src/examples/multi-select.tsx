import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { MultiSelect } from 'mireco'
import type { SelectValue } from 'mireco'

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

const DemoMultiSelect = () => {
  const [value, setValue] = useState<SelectValue[]>([])
  const handleValueChange = useCallback((newValue: SelectValue[], wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <MultiSelect
        value={value}
        options={OPTIONS}
        onChange={handleValueChange}
        placeholder="Select values"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-multi-select')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoMultiSelect />)
}
