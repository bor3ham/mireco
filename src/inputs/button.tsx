import React, { forwardRef } from 'react'
import classNames from 'classnames'

export interface ButtonProps {
  // mireco
  block?: boolean
  // button
  type?: 'submit' | 'reset' | 'button'
  // html
  id?: string
  className?: string
  tabIndex?: number
  title?: string
  autoFocus?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
  // form
  disabled?: boolean
  name?: string
  formValue?: string
  // event handlers
  onFocus?(event: React.FocusEvent<HTMLButtonElement>): void
  onBlur?(event: React.FocusEvent<HTMLButtonElement>): void
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLButtonElement>): void  
  onMouseMove?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLButtonElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLButtonElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLButtonElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLButtonElement>): void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  block,
  type = 'submit',
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
  children,
  disabled,
  name,
  formValue,
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
}, ref) => (
  <button
    ref={ref}
    id={id}
    className={classNames(
      'MIRECO-button MIRECO-blockable',
      {
        block,
      },
      className,
    )}
    tabIndex={tabIndex}
    title={title}
    autoFocus={autoFocus}
    style={style}
    disabled={disabled}
    name={name}
    value={formValue}
    // eslint-disable-next-line react/button-has-type
    type={type}
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
  </button>
))
