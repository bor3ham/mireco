import React, { useContext } from 'react'
import { Text } from 'mireco'
import casual from 'casual-browserify'

import { LabWrapper, LabContext } from '../components'

const stringify = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

const getRandomValue = () => {
  if (casual.coin_flip) return ''
  return casual.title
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

export const TextLab = () => {
  
  return (
    <LabWrapper
      initialValue={''}
      getRandomValue={getRandomValue}
      stringify={stringify}
    >
      <Contents />
    </LabWrapper>
  )
}
