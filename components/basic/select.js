import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Select } from 'mireco'

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

function DemoText(props) {
  const [value, setValue] = useState(null)
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <Select
        block
        placeholder="Select value"
        value={value}
        options={OPTIONS}
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-select')
if (mount.length) {
  ReactDOM.render(<DemoText />, mount[0])
}
