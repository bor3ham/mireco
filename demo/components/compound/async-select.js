import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { AsyncSelect } from 'mireco'

function DemoAsyncSelect(props) {
  const [value, setValue] = useState(null)
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  const getOptions = (searchTerm) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        const keyedTerm = searchTerm.toLowerCase().trim().replace(' ', '_')
        resolve([
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
        ])
      }, 1000)
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
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-async-select')
if (mount.length) {
  ReactDOM.render(<DemoAsyncSelect />, mount[0])
}
