import React, { forwardRef, useCallback, useEffect } from 'react'
import classNames from 'classnames'

export type TextProps = {
  // mireco
  block?: boolean
  // text
  value?: string
  onChange?(newValue: string): void
  type?: string
  placeholder?: string
  maxLength?: number
  size?: number
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string
  // form
  name?: string
  required?: boolean
  disabled?: boolean
  // event handlers
  onFocus?(event?: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLInputElement>): void
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

export const Text = forwardRef<HTMLInputElement, TextProps>(({
  block,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  size,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  name,
  required,
  disabled,
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
    const newValue = event.target.value
    if (onChange) {
      onChange(newValue)
    }
  }, [onChange])

  useEffect(() => {
    if (disabled) {
      if (ref === document.activeElement && onBlur) {
        onBlur()
      }
    } else {
      if (ref === document.activeElement && onFocus) {
        onFocus()
      }
    }
  }, [disabled, onBlur, onFocus])

  return (
    <input
      ref={ref}
      value={value}
      onChange={handleChange}
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      maxLength={maxLength}
      id={id}
      className={classNames(
        'MIRECO-text',
        {
          block: block,
          sized: !!size,
        },
        className,
      )}
      style={style}
      size={size}
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
