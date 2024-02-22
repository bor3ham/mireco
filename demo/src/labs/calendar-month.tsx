import React, { useContext } from 'react'
import { CalendarMonth } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomCalendarMonth } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <CalendarMonth
      block={block}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name="calendar_month"
      placeholder="Select month"
    />
  )
}

export const CalendarMonthLab = () => (
  <LabWrapper
    initialValue={null}
    getRandomValue={getRandomCalendarMonth}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
