import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { MultiSelect } from 'mireco/inputs'

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

function DemoMultiSelect(props) {
  const [value, setValue] = useState([])
  const handleValueChange = (newValue, wasBlur) => {
    setValue(newValue)
  }
  return (
    <>
      <p>Field value: {JSON.stringify(value) || 'undefined'}</p>
      <MultiSelect
        block
        placeholder="Select values"
        value={value}
        options={OPTIONS}
        onChange={handleValueChange}
      />
    </>
  )
}

const mount = document.querySelectorAll('div.demo-mount-multi-select')
if (mount.length) {
  ReactDOM.render(<DemoMultiSelect />, mount[0])
}
