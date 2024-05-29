import React, { forwardRef, useState, useCallback, useRef } from 'react'
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
  className?: string
}

export const WidgetText = forwardRef<HTMLInputElement, WidgetTextProps>((props, forwardedRef) => {
  const {
    block,
    onClear,
    icon = <ChevronDownVector />,
    everClearable = true,
    onFocus,
    onBlur,
    children,
    className,
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
  const textRef = useRef<HTMLInputElement>()
  const handleContainerClick = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  return (
    <WidgetBlock
      block={block}
      className={classNames('MIRECO-widget-text', className)}
      clearable={clearable}
      everClearable={everClearable}
      onClick={handleContainerClick}
      onClear={onClear} 
      icon={icon}
      inFocus={inFocus}
      disabled={inputProps.disabled}
    >
      <Text
        ref={(instance: HTMLInputElement) => {
          textRef.current = instance
          if (typeof forwardedRef === "function") {
            forwardedRef(instance)
          } else if (forwardedRef !== null) {
            // eslint-disable-next-line no-param-reassign
            forwardedRef.current = instance
          }
        }}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="MIRECO-embedded"
      />
      {children}
    </WidgetBlock>
  )
})
