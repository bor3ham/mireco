import React, { useContext } from 'react'
import { Time } from 'mireco'
import casual from 'casual-browserify'

import { LabWrapper, LabContext } from '../components'

const HOUR_MS = 60 * 60 * 1000
const STEP_MS = 15 * 60 * 1000

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => (
  casual.random_element([
    null,
    Math.round(casual.integer(0, 24 * HOUR_MS) / STEP_MS) * STEP_MS, // rounded step
    casual.integer(0, 24 * HOUR_MS), // random uneven time
  ])
)

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Time
      block={block}
      value={value as string}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter time"
      name="time"
    />
  )
}

export const TimeLab = () => {
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
