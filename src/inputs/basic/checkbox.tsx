import React from 'react'
import classNames from 'classnames'

import { Label } from 'components/label'
import { CheckboxInput } from './checkbox-input'

const CHECK_SVG = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
    style={{display: 'none'}}
  >
    <g transform="translate(0,-290.65)">
      <path
        style={{
          fill: 'none',
          strokeWidth: '1.0583',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
        }}
        d="M 1.588,294.090 2.646,295.148 4.763,292.237"
      />
    </g>
  </svg>
)

interface Props {
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

export const Checkbox: React.FC<Props> = ({
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
    {CHECK_SVG}
    {!!children && ' '}
    {!!children && (<span>{children}</span>)}
  </Label>
)
