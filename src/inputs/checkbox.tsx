import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Label } from 'components'
import Check from '../vectors/check.svg'
import { CheckboxInput } from './checkbox-input'

export interface CheckboxProps {
  // mireco
  block?: boolean
  marginless?: boolean
  // checkbox
  value?: boolean
  onChange?(newValue: boolean, event: React.ChangeEvent<HTMLInputElement>): void
  autoComplete?: string
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
  required?: boolean
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

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  block,
  marginless,
  value = false,
  onChange,
  autoComplete,
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
  required,
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
  <Label
    className={classNames(
      'MIRECO-checkbox',
      {
        disabled,
      },
      className,
    )}
    title={title}
    style={style}
    block={block}
    marginless={marginless}
    htmlFor={id}
  >
    <CheckboxInput
      ref={ref}
      id={id}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      disabled={disabled}
      name={name}
      formValue={formValue}
      required={required}
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
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
    />
    <Check />
    {!!children && ' '}
    {!!children && (<span>{children}</span>)}
  </Label>
))
