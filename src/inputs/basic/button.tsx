import React, { MouseEvent } from 'react'
import classNames from 'classnames'

interface ButtonProps {
  type?: 'button' | 'submit'
  name?: string
  value?: string
  disabled?: boolean
  autoFocus?: boolean
  tabIndex?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?(event: MouseEvent<HTMLButtonElement>): void
  onDoubleClick?(event: MouseEvent<HTMLButtonElement>): void
  onMouseDown?(event: MouseEvent<HTMLButtonElement>): void
  onMouseEnter?(event: MouseEvent<HTMLButtonElement>): void
  onMouseLeave?(event: MouseEvent<HTMLButtonElement>): void  
  onMouseMove?(event: MouseEvent<HTMLButtonElement>): void
  onMouseOut?(event: MouseEvent<HTMLButtonElement>): void
  onMouseOver?(event: MouseEvent<HTMLButtonElement>): void
  onMouseUp?(event: MouseEvent<HTMLButtonElement>): void
  block?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  type,
  name,
  value,
  disabled,
  autoFocus,
  tabIndex,
  className,
  style,
  children,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  block,
}) => (
  <button
    type={type}
    name={name}
    value={value}
    disabled={disabled}
    autoFocus={autoFocus}
    tabIndex={tabIndex}
    className={classNames(
      'MIRECO-button',
      {
        block: block,
      },
      className,
    )}
    style={style}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onMouseDown={onMouseDown}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onMouseMove={onMouseMove}
    onMouseOut={onMouseOut}
    onMouseOver={onMouseOver}
    onMouseUp={onMouseUp}
  >
    {children}
  </button>
)
