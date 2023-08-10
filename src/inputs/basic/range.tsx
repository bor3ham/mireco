import React, { forwardRef, useCallback } from 'react'
import classNames from 'classnames'

import type { RangeInputValue } from 'types'

export interface RangeProps {
  // mireco
  block?: boolean
  // number
  value?: RangeInputValue
  onChange?(newValue: RangeInputValue, event: React.ChangeEvent<HTMLInputElement>): void
  min?: number
  max?: number
  step?: number
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string
  autoComplete?: string
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

export const Range = forwardRef<HTMLInputElement, RangeProps>(({
  block,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  autoComplete,
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
    if (onChange) {
      onChange(+event.target.value, event)
    }
  }, [
    onChange,
  ])
  return (
    <input
      ref={ref}
      type="range"
      value={value || ''}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      id={id}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={style}
      className={classNames(
        'MIRECO-range',
        {
          block,
        },
        className,
      )}
      title={title}
      autoComplete={autoComplete}
      name={name}
      required={required}
      disabled={disabled}
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
