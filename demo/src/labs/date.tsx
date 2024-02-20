import React, { useContext } from 'react'
import { Date as DateInput, ISO_8601_DATE_FORMAT } from 'mireco'
import casual from 'casual-browserify'
import { addDays, subDays, format } from 'date-fns'

import { LabWrapper, LabContext } from '../components'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => (
  casual.random_element([
    null,
    format(addDays(subDays(new Date(), 30), casual.integer(60)), ISO_8601_DATE_FORMAT),
  ])
)

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

export const DateLab = () => {
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
