import React, { forwardRef, useState, useCallback } from 'react'
import classNames from 'classnames'

import { TimeText, type TimeTextProps, type TimeTextHandle } from './time-text'
import { ClockVector } from 'vectors'
import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'

export interface WidgetTimeTextProps extends TimeTextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
}

export const WidgetTimeText = forwardRef<TimeTextHandle, WidgetTimeTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <ClockVector />,
    everClearable = true,
    onFocus,
    onBlur,
    ...inputProps
  } = props
  const [inFocus, setInFocus] = useState(false)
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(true)
    if (onFocus) {
      onFocus(event)
    }
  }, [
    onFocus,
  ])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(false)
    if (onBlur) {
      onBlur(event)
    }
  }, [
    onBlur,
  ])
  const clearable = !!onClear
  return (
    <BlockDiv
      block={block}
      className={classNames('MIRECO-widget-text', {
        'has-icon': !!icon,
        'ever-clearable': everClearable,
        'in-focus': inFocus,
      })}
    >
      <TimeText
        ref={ref}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        block={block}
      />
      {clearable && (
        <ClearButton
          onClick={onClear}
        />
      )}
      {icon}
    </BlockDiv>
  )
})
