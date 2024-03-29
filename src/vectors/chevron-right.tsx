import React from 'react'

import { ChevronLeftVector } from './chevron-left'

interface Props {
  style?: React.CSSProperties
}

export const ChevronRightVector = ({
  style,
}: Props) => (
  <ChevronLeftVector
    style={{
      transform: 'scaleX(-1)',
      ...style,
    }}
  />
)
