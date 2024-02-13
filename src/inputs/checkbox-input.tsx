import React, { forwardRef, useCallback } from 'react'
import classNames from 'classnames'

export interface CheckboxInputProps {
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

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(({
  value = false,
  onChange,
  autoComplete,
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
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
}, ref) => {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    if (onChange) {
      onChange(newValue, event)
    }
  }, [
    onChange,
  ])
  return (
    <input
      ref={ref}
      type="checkbox"
      id={id}
      className={classNames('MIRECO-checkbox-input', className)}
      tabIndex={tabIndex}
      title={title}
      autoFocus={autoFocus}
      style={style}
      disabled={disabled}
      name={name}
      value={formValue}
      required={required}
      checked={!!value}
      autoComplete={autoComplete}
      onChange={handleChange}
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
  )
})
