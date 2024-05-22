import React from 'react'
import classNames from 'classnames'

type ControlsPopoverProps = {
  children: React.ReactNode
  className?: string
}

// where possible, don't even use this component and just add .MIRECO-controls-popover
// to your existing wrapper
export const ControlsPopover: React.FC<ControlsPopoverProps> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames('MIRECO-controls-popover', className)}>
      {children}
    </div>
  )
}
