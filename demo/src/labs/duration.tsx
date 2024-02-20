import React, { useContext } from 'react'
import { Duration } from 'mireco'
import casual from 'casual-browserify'

import { LabWrapper, LabContext } from '../components'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => (
  casual.random_element([
    null,
    casual.integer(48) * HOUR_MS,
    casual.integer(12 * 60) * MINUTE_MS,
  ])
)

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

export const DurationLab = () => {
  return (
    <LabWrapper
      initialValue={null}
      getRandomValue={getRandomValue}
      stringify={stringify}
    >
      <Contents />
    </LabWrapper>
  )
}
