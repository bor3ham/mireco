import React from 'react'
import classNames from 'classnames'

import type { MirecoLayoutProps } from 'types/mireco'

type LabelProps = React.HTMLProps<HTMLLabelElement> & MirecoLayoutProps

export const Label = ({
  block,
  marginless,
  ref,
  children,
  ...vanillaProps
}: LabelProps) => (
  <label
    ref={ref}
    {...vanillaProps}
    className={classNames(
      'MIRECO-label MIRECO-blockable',
      {
        'MIRECO-block': block,
        'MIRECO-marginless': marginless,
      },
      vanillaProps.className,
    )}
  >
    {children}
  </label>
)
