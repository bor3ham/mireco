import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { AdvancedPopover, type AdvancedPopoverRef } from './advanced-popover'
import { Button } from 'inputs'

interface TimeRangePopoverProps {
  children: React.ReactNode
  focusedOnStart: boolean
  focusOnStart(): void
  focusOnEnd(): void
  className?: string
  shortcuts?: {
    value: any
    label: string
  }[]
  onSelectShortcut?(newValue: any): void
  focusOnField(): void
}

export const TimeRangePopover = forwardRef<AdvancedPopoverRef, TimeRangePopoverProps>(({
  children,
  focusedOnStart,
  focusOnStart,
  focusOnEnd,
  className,
  shortcuts,
  onSelectShortcut,
  focusOnField,
}, ref) => (
  <AdvancedPopover
    ref={ref}
    className={classNames('MIRECO-time-range-popover', className)}
    shortcuts={shortcuts}
    onSelectShortcut={onSelectShortcut}
    focusOnField={focusOnField}
    header={(
      <div>
        <Button
          type="button"
          className={classNames({'MIRECO-content': focusedOnStart, 'MIRECO-drawer': !focusedOnStart})}
          onClick={focusOnStart}
          tabIndex={-1}
        >
          Start
        </Button>
        <Button
          type="button"
          className={classNames({'MIRECO-content': !focusedOnStart, 'MIRECO-drawer': focusedOnStart})}
          onClick={focusOnEnd}
          tabIndex={-1}
        >
          End
        </Button>
      </div>
    )}
  >
    {children}
  </AdvancedPopover>
))
