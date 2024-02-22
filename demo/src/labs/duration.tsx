import React, { useContext } from 'react'
import { Duration } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomDuration } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Duration
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter duration"
    />
  )
}

export const DurationLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomDuration}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
