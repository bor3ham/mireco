import React from 'react'
import classNames from 'classnames'

interface Props {
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

export const Label: React.FC<Props> = ({
  block,
  htmlFor,
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
  children,
}) => (
  <label
    htmlFor={htmlFor}
    id={id}
    className={classNames(
      'MIRECO-label',
      {
        block,
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
)
