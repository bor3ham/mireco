import React, { forwardRef, useState, useCallback } from 'react'
import classNames from 'classnames'

import { DateText, type DateTextProps, type DateTextHandle } from './date-text'
import { CalendarVector } from 'vectors'
import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'

export interface WidgetDateTextProps extends DateTextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
}

export const WidgetDateText = forwardRef<DateTextHandle, WidgetDateTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <CalendarVector />,
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
      <DateText
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
