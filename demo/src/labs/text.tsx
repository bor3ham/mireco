import React, { useContext } from 'react'
import { Text } from 'mireco'

import { LabWrapper, LabContext } from '../components'
import { getRandomText } from '../random'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const Contents = () => {
  const { block, value, onChange, disabled } = useContext(LabContext)
  return (
    <Text
      block={block}
      value={value as string}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter text"
      name="text"
    />
  )
}

export const TextLab = () => (
  <LabWrapper
    initialValue={''}
    getRandomValue={getRandomText}
    stringify={stringify}
  >
    <Contents />
  </LabWrapper>
)
