import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { AsyncSelect } from 'mireco'

const SIMULATED_LAG = 1000

function fakeResults(searchTerm) {
  const keyedTerm = searchTerm.toLowerCase().trim().replace(' ', '_')
  return [
    {
      value: `${keyedTerm}_rusted`,
      label: `${searchTerm} Rusted`,
    },
    {
      value: `${keyedTerm}`,
      label: `${searchTerm} (500)`,
    },
    {
      value: `new_${keyedTerm}`,
      label: `New ${searchTerm}`,
    },
    {
      value: 'unfiltered_result',
      label: 'Result to test filtering is not happening',
    },
  ]
}

const DemoAsyncSelect = () => {
  const [value, setValue] = useState(null)
  const handleChange = useCallback((newValue, wasBlur) => {
    setValue(newValue)
  }, [])
  const getOptions = (searchTerm) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolve(fakeResults(searchTerm))
      }, SIMULATED_LAG)
    })
  }
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <AsyncSelect
        block
        placeholder="Select value"
        value={value}
        getOptions={getOptions}
        onChange={handleChange}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-async-select')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoAsyncSelect />)
}
