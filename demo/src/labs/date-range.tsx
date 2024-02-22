import React, { useContext } from 'react'
import { DateRange } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomDateRange } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <DateRange
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name="date_range"
    />
  )
}

export const DateRangeLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomDateRange}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
