import React, { useState, useCallback, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'

import { Text, type TextRef } from 'inputs'
import type { TextProps } from 'inputs'
import Chevron from '../vectors/chevron.svg'
import { WidgetBlock, type WidgetBlockRef } from './widget-block'

export type WidgetTextRef = {
  focus(): void
  element: HTMLDivElement | null
}

export type WidgetTextProps = Omit<TextProps, 'ref'> & {
  ref?: React.Ref<WidgetTextRef>
  icon?: React.ReactNode
  inFocus?: boolean
  onClear?(): void
  onContainerBlur?(event: React.FocusEvent): void
}

export const WidgetText = ({
  // widget text specific
  ref,
  icon = <Chevron className="MIRECO-chevron" />,
  inFocus,
  onClear,
  onContainerBlur,
  // parent steals some text props
  className,
  style,
  block,
  marginless,
  children,
  // rest are passed through
  ...textProps
}: WidgetTextProps) => {
  const containerRef = useRef<WidgetBlockRef>(null)
  const textRef = useRef<TextRef>(null)
  const focus = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  useImperativeHandle(ref, () => ({
    focus,
    element: containerRef.current ? containerRef.current.element : null,
  }), [focus])
  const [innerInFocus, setInnerInFocus] = useState(false)
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInnerInFocus(true)
    if (textProps.onFocus) {
      textProps.onFocus(event)
    }
  }, [
    textProps.onFocus,
  ])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInnerInFocus(false)
    if (textProps.onBlur) {
      textProps.onBlur(event)
    }
  }, [
    textProps.onBlur,
  ])
  const clearable = !!onClear
  const handleContainerClick = useCallback(() => {
    focus()
  }, [focus])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      containerRef.current.element && (
        containerRef.current.element.contains(event.relatedTarget) ||
        containerRef.current.element === event.relatedTarget
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
      marginless={marginless}
      className={classNames('MIRECO-widget-text', className)}
      style={style}
      clearable={clearable}
      onClick={handleContainerClick}
      onClear={onClear}
      onBlur={handleContainerBlur}
      icon={icon}
      inFocus={typeof inFocus === 'undefined' ? innerInFocus : inFocus}
      disabled={textProps.disabled}
    >
      <Text
        block
        ref={textRef}
        {...textProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="MIRECO-embedded"
      />
      {children}
    </WidgetBlock>
  )
}
