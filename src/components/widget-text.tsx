import React, { forwardRef, useState, useCallback } from 'react'
import classNames from 'classnames'

import { Text } from 'inputs'
import type { TextProps } from 'inputs'
import { ChevronDownVector } from 'vectors'
import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'

export interface WidgetTextProps extends TextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
  // event handlers
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event: React.FocusEvent<HTMLInputElement>): void
  onClick?(event: React.MouseEvent<HTMLInputElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLInputElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLInputElement>): void
}

export const WidgetText = forwardRef<HTMLInputElement, WidgetTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <ChevronDownVector />,
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
      <Text
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
