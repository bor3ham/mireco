import React, { useCallback } from 'react'
import classNames from 'classnames'

interface Props {
  // checkbox
  value?: boolean
  onChange?(newValue: boolean, event: React.ChangeEvent<HTMLInputElement>): void
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
}

export const CheckboxInput: React.FC<Props> = ({
  value,
  onChange,
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
}) => {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    if (onChange) {
      onChange(newValue, event)
    }
  }, [])
  return (
    <input
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
      onChange={handleChange}
    >
      {children}
    </input>
  )
}
