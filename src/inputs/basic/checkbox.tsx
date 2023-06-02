import React from 'react'
import classNames from 'classnames'

import { Label } from 'components'
import { CheckboxInput } from './checkbox-input'
import { CheckVector } from 'vectors'

export interface CheckboxProps {
  // mireco
  block?: boolean
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

export const Checkbox: React.FC<CheckboxProps> = ({
  block,
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
}) => (
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
    htmlFor={id}
  >
    <CheckboxInput
      id={id}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      disabled={disabled}
      name={name}
      formValue={formValue}
      required={required}
      value={value}
      onChange={onChange}
    />
    <CheckVector />
    {!!children && ' '}
    {!!children && (<span>{children}</span>)}
  </Label>
)
