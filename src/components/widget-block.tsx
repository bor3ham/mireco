import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { BlockDiv, type BlockDivProps } from './block-div'
import { ClearButton } from './clear-button'

interface WidgetBlockProps extends BlockDivProps {
  clearable?: boolean
  everClearable?: boolean
  onClear?(): void
  icon?: React.ReactNode
  inFocus?: boolean
  disabled?: boolean
  children?: React.ReactNode
  clearButtonClassName?: string
}

/** Wrapper to combine inputs together with an optional icon and/or clear prompt */
export const WidgetBlock = forwardRef<HTMLDivElement, WidgetBlockProps>(({
  clearable = false,
  everClearable = false,
  onClear,
  icon = null,
  inFocus = false,
  disabled = false,
  children,
  block,
  style,
  className,
  id,
  clearButtonClassName,
  onFocus,
  onBlur,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onKeyDown,
  onKeyUp,
}, ref) => {
  return (
    <BlockDiv
      block={block}
      ref={ref}
      style={style}
      className={classNames(className, 'MIRECO-widget-block', {
        'ever-clearable': everClearable,
        'clearable': clearable,
        'has-icon': !!icon,
        'MIRECO-in-focus': inFocus,
        disabled,
      })}
      id={id}
      tabIndex={-1}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
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
})
