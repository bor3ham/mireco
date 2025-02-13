import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Button } from 'inputs'
import Cross from '../vectors/cross.svg'

export interface ClearButtonProps {
  onClick?(): void
  tabIndex?: number
  disabled?: boolean
  className?: string
  spaced?: boolean
}

export const ClearButton = forwardRef<HTMLButtonElement, ClearButtonProps>(({
  onClick,
  tabIndex = -1,
  disabled,
  className,
}, ref) => (
  <Button
    ref={ref}
    tabIndex={tabIndex}
    onClick={onClick}
    className={classNames('MIRECO-clear-button content outline', className)}
    disabled={disabled}
    type="button"
  >
    <Cross className="MIRECO-cross" />
  </Button>
))
