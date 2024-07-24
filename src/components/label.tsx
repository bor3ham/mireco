import React, { forwardRef } from 'react'
import classNames from 'classnames'

export interface LabelProps {
  // mireco
  block?: boolean
  // label
  htmlFor?: string
  // html
  id?: string
  className?: string
  tabIndex?: number
  title?: string
  autoFocus?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  block,
  htmlFor,
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
  children,
}, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    id={id}
    className={classNames(
      'MIRECO-label MIRECO-blockable',
      {
        'MIRECO-block': block,
      },
      className,
    )}
    tabIndex={tabIndex}
    title={title}
    autoFocus={autoFocus}
    style={style}
  >
    {children}
  </label>
))
