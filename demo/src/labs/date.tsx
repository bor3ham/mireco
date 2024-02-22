import React, { useContext } from 'react'
import { Date as DateInput } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomDate } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <DateInput
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name="date"
    />
  )
}

export const DateLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomDate}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
