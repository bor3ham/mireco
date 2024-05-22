import React from 'react'
import classNames from 'classnames'

import { Button } from '../inputs'

type StartEndHeaderProps = {
  className?: string
  focusedOnStart: boolean
  onStartClick(): void
  onEndClick(): void
}

export const StartEndHeader: React.FC<StartEndHeaderProps> = ({
  className,
  focusedOnStart,
  onStartClick,
  onEndClick,
}) => {
  return (
    <div className={classNames('MIRECO-start-end-header', className)}>
      <Button
        type="button"
        className={classNames({
          'other': !focusedOnStart,
        })}
        onClick={onStartClick}
        tabIndex={-1}
      >
        Start
      </Button>
      {' '}
      <Button
        type="button"
        className={classNames({
          'other': focusedOnStart,
        })}
        onClick={onEndClick}
        tabIndex={-1}
      >
        End
      </Button>
    </div>
  )
}
