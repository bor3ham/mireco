import React, { useState, useCallback } from 'react'
import { AsyncSelect, type SelectOption, type SelectOptionInputValue } from 'mireco'

const SIMULATED_LAG = 1000

const stringifyValue = (value: SelectOptionInputValue) => {
  if (typeof value === 'undefined') return undefined
  return JSON.stringify(value)
}

const fakeResults = (searchTerm: string): Promise<SelectOption[]> => {
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

export const AsyncSelectExample = () => {
  const [value, setValue] = useState<SelectOptionInputValue>(null)
  const handleChange = useCallback((newValue: SelectOptionInputValue, wasBlur: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {stringifyValue(value)}</code></p>
      <AsyncSelect
        value={value}
        onChange={handleChange}
        getOptions={fakeResults}
        placeholder="Select value"
      />
    </>
  )
}
