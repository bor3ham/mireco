import React, { useCallback } from 'react'
import classNames from 'classnames'

import type { SelectValue } from 'types'
import { ToggleSelect } from 'inputs'

const OPTIONS = [
  {
    value: 'start',
    label: 'Start',
  },
  {
    value: 'end',
    label: 'End',
  },
]

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
  const handleChange = useCallback((newValue: SelectValue) => {
    if (newValue === 'start') {
      onStartClick()
    } else {
      onEndClick()
    }
  }, [])
  return (
    <ToggleSelect
      block
      value={focusedOnStart ? 'start' : 'end'}
      options={OPTIONS}
      onChange={handleChange}
      className={classNames('MIRECO-start-end-header', className)}
      style={{marginBottom: '0', textAlign: 'center', borderRadius: '0'}}
    />
  )
}
