import React, { useCallback } from 'react'
import classNames from 'classnames'

import type { SelectValue, SelectOption } from 'types'
import { Button } from './button'
import { BlockDiv } from 'components'

type ToggleSelectProps = {
  block?: boolean
  value: SelectValue
  options: SelectOption[]
  onChange(newValue: SelectValue): void
  className?: string
  style?: React.CSSProperties
}

export const ToggleSelect: React.FC<ToggleSelectProps> = ({
  block,
  value,
  options,
  onChange,
  className,
  style,
}) => {
  const handleSelect = useCallback((newValue: SelectValue) => {
    if (onChange) {
      onChange(newValue)
    }
  }, [])
  return (
    <BlockDiv
      className={classNames('MIRECO-toggle-select', className)}
      style={style}
      block={block}
    >
      {options.map((option) => (
        <Button
          key={`${option.value}`}
          type="button"
          onClick={() => {
            handleSelect(option.value)
          }}
          className={classNames({
            active: option.value === value,
          }, 'MIRECO-content MIRECO-outline')}
          tabIndex={-1}
        >
          {option.label}
        </Button>
      ))}
    </BlockDiv>
  )
}
