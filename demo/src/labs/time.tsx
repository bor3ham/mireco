import React, { useContext } from 'react'
import { Time } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomTime } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Time
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter time"
      name="time"
    />
  )
}

export const TimeLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomTime}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
