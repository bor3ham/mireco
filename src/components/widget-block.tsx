import React, { useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'

import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'
import type { MirecoLayoutProps } from 'types/mireco'

export type WidgetBlockRef = {
  element: HTMLDivElement | null
}

export type WidgetBlockProps = Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & {
  ref?: React.Ref<WidgetBlockRef>
  clearable?: boolean
  onClear?(): void
  icon?: React.ReactNode
  inFocus?: boolean
  disabled?: boolean
  clearButtonClassName?: string
} & MirecoLayoutProps

/** Wrapper to combine inputs together with an optional icon and/or clear prompt */
export const WidgetBlock = ({
  block,
  marginless,
  ref,
  clearable = false,
  onClear,
  icon = null,
  inFocus = false,
  disabled = false,
  clearButtonClassName,
  // parent steals some props
  className,
  children,
  // rest are passed through
  ...vanillaProps
}: WidgetBlockProps) => {
  const divRef = useRef(null)
  useImperativeHandle(ref, () => ({
    element: divRef.current,
  }), [])
  return (
    <BlockDiv
      ref={divRef}
      {...vanillaProps}
      block={block}
      marginless={marginless}
      className={classNames(className, 'MIRECO-widget-block', {
        'clearable': clearable,
        'has-icon': !!icon,
        'MIRECO-in-focus': inFocus,
        disabled,
      })}
    >
      {children}
      {clearable && !disabled && (
        <ClearButton
          onClick={onClear}
          className={clearButtonClassName}
        />
      )}
      {icon}
    </BlockDiv>
  )
}
