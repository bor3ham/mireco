import React, { useContext } from 'react'
import { Month, ISO_8601_MONTH_FORMAT } from 'mireco'
import casual from 'casual-browserify'
import { format, addDays, subDays } from 'date-fns'

import { LabWrapper, LabContext } from '../components'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => (
  casual.random_element([
    null,
    format(addDays(subDays(new Date(), 365), casual.integer(0, 365 * 2)), ISO_8601_MONTH_FORMAT),
  ])
)

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Month
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name="month"
      placeholder="Select month"
    />
  )
}

export const MonthLab = () => {
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
