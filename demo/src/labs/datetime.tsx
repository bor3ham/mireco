import React, { useContext } from 'react'
import { Datetime } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomDatetime } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Datetime
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      // name="datetime"
    />
  )
}

export const DatetimeLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomDatetime}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
