import React, { forwardRef, useState, useCallback, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'

import { Text, type TextRef } from 'inputs'
import type { TextProps } from 'inputs'
import Chevron from '../vectors/chevron.svg'
import { WidgetBlock } from './widget-block'

export type WidgetTextRef = {
  focus(): void
  element: HTMLDivElement | null
}

export interface WidgetTextProps extends TextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
  children?: React.ReactNode
  className?: string
  onContainerBlur?(event: React.FocusEvent): void
  inFocus?: boolean
}

export const WidgetText = forwardRef<WidgetTextRef, WidgetTextProps>((props, forwardedRef) => {
  const {
    block,
    onClear,
    icon = <Chevron className="MIRECO-chevron" />,
    everClearable = true,
    onFocus,
    onBlur,
    children,
    className,
    onContainerBlur,
    inFocus,
    ...inputProps
  } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<TextRef>(null)
  const focus = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  useImperativeHandle(forwardedRef, () => ({
    focus,
    element: containerRef.current,
  }), [focus])
  const [innerInFocus, setInnerInFocus] = useState(false)
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInnerInFocus(true)
    if (onFocus) {
      onFocus(event)
    }
  }, [
    onFocus,
  ])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInnerInFocus(false)
    if (onBlur) {
      onBlur(event)
    }
  }, [
    onBlur,
  ])
  const clearable = !!onClear
  const handleContainerClick = useCallback(() => {
    focus()
  }, [focus])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current
      && (
        containerRef.current.contains(event.relatedTarget) ||
        containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    if (onContainerBlur) {
      onContainerBlur(event)
    }
  }, [onContainerBlur])
  return (
    <WidgetBlock
      ref={containerRef}
      block={block}
      className={classNames('MIRECO-widget-text', className)}
      clearable={clearable}
      everClearable={everClearable}
      onClick={handleContainerClick}
      onClear={onClear}
      onBlur={handleContainerBlur}
      icon={icon}
      inFocus={typeof inFocus === 'undefined' ? innerInFocus : inFocus}
      disabled={inputProps.disabled}
    >
      <Text
        block
        ref={textRef}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="MIRECO-embedded"
      />
      {children}
    </WidgetBlock>
  )
})
