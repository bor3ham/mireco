import React from 'react'

import { ChevronLeftVector } from './chevron-left'

interface Props {
  style?: React.CSSProperties
}

export const ChevronDownVector = ({
  style,
}: Props) => (
  <ChevronLeftVector
    style={{
      transform: 'rotate(270deg)',
      ...style,
    }}
  />
)
