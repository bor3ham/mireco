import React, { useContext } from 'react'
import { DatetimeRange } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomDatetimeRange } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <DatetimeRange
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      // name="datetime"
    />
  )
}

export const DatetimeRangeLab = () => (
  <LabWrapper
    initialValue={{
      start: null,
      end: null,
    }}
    getRandomValue={getRandomDatetimeRange}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
