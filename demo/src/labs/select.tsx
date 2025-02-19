import React, { useContext } from 'react'
import { Select } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomOption } from '../random'

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

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Select
      value={value}
      onChange={onChange}
      options={OPTIONS}
      placeholder="Select a value"
      disabled={disabled}
      block={block}
    />
  )
}

export const SelectLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={() => (getRandomOption(OPTIONS))}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
