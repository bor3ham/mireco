import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Text } from 'inputs'
import type { TextProps } from 'inputs'
import { ChevronDownVector } from 'vectors'
import { BlockDiv } from './block-div'
import { ClearButton } from './clear-button'

interface WidgetTextProps extends TextProps {
  // widget text
  onClear?(): void
  icon?: React.ReactNode
  everClearable?: boolean
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

export const WidgetText = forwardRef<HTMLInputElement, WidgetTextProps>((props, ref) => {
  const {
    block,
    onClear,
    icon = <ChevronDownVector />,
    everClearable = true,
    ...inputProps
  } = props
  const clearable = !!onClear
  return (
    <BlockDiv
      block={block}
      className={classNames('MIRECO-widget-text', {
        'ever-clearable': everClearable,
      })}
    >
      <Text
        ref={ref}
        {...inputProps}
        block={block}
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
