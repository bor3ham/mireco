import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Text } from 'inputs'
import type { TextProps } from 'inputs'
import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'
import { ChevronDownVector } from 'vectors'

interface WidgetTextProps extends TextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
}

export const WidgetText = forwardRef<HTMLInputElement, WidgetTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <ChevronDownVector />,
    ...inputProps
  } = props
  const clearable = !!onClear
  return (
    <BlockDiv
      block={block}
      className={classNames('MIRECO-widget-text', {
        clearable,
      })}
    >
      <Text
        ref={ref}
        {...inputProps}
      />
      {clearable && (
        <ClearButton
          onClick={onClear}
        />
      )}
      {icon}
    </BlockDiv>
  )
})
