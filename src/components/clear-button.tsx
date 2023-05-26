import React from 'react'
import classNames from 'classnames'

import { Button } from 'inputs'
import { CrossVector } from 'vectors'

interface Props {
  onClick?(): void
  tabIndex?: number
  disabled?: boolean
  className?: string
  spaced?: boolean
}

export const ClearButton: React.FC<Props> = ({
  onClick,
  tabIndex = -1,
  disabled,
  className,
  spaced = true,
}) => (
  <Button
    tabIndex={tabIndex}
    onClick={onClick}
    className={classNames('MIRECO-clear-button content outline', className)}
    disabled={disabled}
  >
    {spaced && (<>&nbsp;</>)}
    <CrossVector />
    {spaced && (<>&nbsp;</>)}
  </Button>
)
