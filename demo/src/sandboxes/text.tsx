import React, { useContext, useCallback } from 'react'
import { Text } from 'mireco'
import casual from 'casual-browserify'

import { SandboxWrapper, SandboxContext } from '../components'

export const Contents = () => {
  const { block, value, onChange, disabled } = useContext(SandboxContext)
  return (
    <Text
      block={block}
      value={value as string}
      onChange={onChange}
      disabled={disabled}
      placeholder="Enter text"
    />
  )
}

export const TextSandbox = () => {
  const getRandomValue = useCallback(() => {
    if (casual.coin_flip) return ''
    return casual.title
  }, [])
  return (
    <SandboxWrapper initialValue={''} getRandomValue={getRandomValue}>
      <Contents />
    </SandboxWrapper>
  )
}
