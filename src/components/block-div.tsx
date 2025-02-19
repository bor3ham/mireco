import React, { forwardRef } from 'react'
import classNames from 'classnames'

export interface BlockDivProps {
  // mireco
  block?: boolean
  marginless?: boolean
  // block div
  inlineDisplay?: string
  // html
  id?: string
  className?: string
  tabIndex?: number
  style?: React.CSSProperties
  children?: React.ReactNode,
  // event handlers
  onFocus?(event: React.FocusEvent<HTMLDivElement>): void
  onBlur?(event: React.FocusEvent<HTMLDivElement>): void
  onClick?(event: React.MouseEvent<HTMLDivElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLDivElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLDivElement>): void
}

export const BlockDiv = forwardRef<HTMLDivElement, BlockDivProps>(({
  block,
  marginless,
  inlineDisplay = 'inline-block',
  id,
  className,
  tabIndex,
  style,
  children,
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
  let combinedStyle: React.CSSProperties = {}
  if (!block) {
    combinedStyle.display = inlineDisplay
  }
  combinedStyle = {
    ...combinedStyle,
    ...style,
  }
  return (
    <div
      ref={ref}
      style={combinedStyle}
      className={classNames('MIRECO-blockable', className, {
        'MIRECO-block': block,
        'MIRECO-marginless': marginless,
      })}
      id={id}
      tabIndex={tabIndex}
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
    </div>
  )
})
