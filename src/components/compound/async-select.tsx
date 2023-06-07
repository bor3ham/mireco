import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { AsyncSelect } from 'mireco'
import type { SelectOption, SelectOptionValue } from 'mireco'

const SIMULATED_LAG = 1000

function fakeResults(searchTerm: string): Promise<SelectOption[]> {
  const keyedTerm = searchTerm.toLowerCase().trim().replace(' ', '_')
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve([
        {
          value: `${keyedTerm}`,
          label: `Basic ${searchTerm}`,
        },
        {
          value: `new_${keyedTerm}`,
          label: `New ${searchTerm}`,
        },
        {
          value: 'other_item',
          label: 'Other Item',
        },
      ])
    }, SIMULATED_LAG)
  })
}

const DemoAsyncSelect = () => {
  const [value, setValue] = useState<SelectOptionValue>(null)
  const handleChange = useCallback((newValue: SelectOptionValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <AsyncSelect
        value={value}
        getOptions={fakeResults}
        onChange={handleChange}
        placeholder="Select value"
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-async-select')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoAsyncSelect />)
}
