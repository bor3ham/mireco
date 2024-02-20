import React, { useContext } from 'react'
import { Datetime } from 'mireco'
import casual from 'casual-browserify'

import { LabWrapper, LabContext } from '../components'

const DAY_MS = 24 * 60 * 60 * 1000
const STEP_MS = 15 * 60 * 1000

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => (
  casual.random_element([
    null,
    Math.round((+(new Date()) + casual.integer(-30 * DAY_MS, 30 * DAY_MS)) / STEP_MS) * STEP_MS, // rounded step
    +(new Date()) + casual.integer(-30 * DAY_MS, 30 * DAY_MS), // random uneven time
  ])
)

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

export const DatetimeLab = () => {
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
