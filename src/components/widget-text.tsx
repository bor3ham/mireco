import React, { forwardRef, useState, useCallback } from 'react'
import classNames from 'classnames'

import { Text } from 'inputs'
import type { TextProps } from 'inputs'
import { ChevronDownVector } from 'vectors'
import { WidgetBlock } from './widget-block'

export interface WidgetTextProps extends TextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
  children?: React.ReactNode
}

export const WidgetText = forwardRef<HTMLInputElement, WidgetTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <ChevronDownVector />,
    everClearable = true,
    onFocus,
    onBlur,
    children,
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
    <WidgetBlock
      block={block}
      className={classNames('MIRECO-widget-text')}
      clearable={clearable}
      everClearable={everClearable}
      onClear={onClear}
      icon={icon}
      inFocus={inFocus}
      disabled={inputProps.disabled}
    >
      <Text
        ref={ref}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="MIRECO-embedded"
      />
      {children}
    </WidgetBlock>
  )
})
