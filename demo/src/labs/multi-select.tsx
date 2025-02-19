import React, { useContext } from 'react'
import { MultiSelect } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomOptions } from '../random'

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

const stringify = (value: any) => {
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={OPTIONS}
      placeholder="Select from values"
      block={block}
      disabled={disabled}
    />
  )
}

export const MultiSelectLab = () => (
  <LabWrapper
    initialValue={[]}
    getRandomValue={() => (getRandomOptions(OPTIONS))}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
