import React, { useContext } from 'react'
import { Checkbox } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomCheckbox } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Checkbox
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name="checkbox"
    >
      Checked
    </Checkbox>
  )
}

export const CheckboxLab = () => (
  <LabWrapper
    initialValue={false}
    getRandomValue={getRandomCheckbox}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
