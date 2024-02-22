import React from 'react'

import { DoubleChevronLeftVector } from './double-chevron-left'

interface Props {
  style?: React.CSSProperties
}

export const DoubleChevronRightVector = ({
  style,
}: Props) => (
  <DoubleChevronLeftVector
    style={{
      transform: 'scaleX(-1)',
      ...style,
    }}
  />
)
