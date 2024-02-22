import React, { useContext } from 'react'
import { Textarea } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomTextarea } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Textarea
      block={block}
      value={value as string}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter long text"
      name="textarea"
    />
  )
}

export const TextareaLab = () => (
  <LabWrapper
    initialValue={''}
    getRandomValue={getRandomTextarea}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
