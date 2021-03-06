import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Text from '../inputs/basic/text.js'
import BlockDiv from './block-div.js'
import ClearButton from './clear-button.js'
import ChevronDownVector from './chevron-down-vector.js'

let WidgetText = (props, ref) => {
  const { onClear, icon, ...inputProps } = props
  const clearable = typeof onClear === 'function'
  return (
    <BlockDiv block={props.block} className={classNames('MIRECO-widget-text', {
      clearable,
    })}>
      <Text
        {...inputProps}
        ref={ref}
      />
      {clearable && (
        <ClearButton
          onClick={props.onClear}
        />
      )}
      {icon}
    </BlockDiv>
  )
}
WidgetText = React.forwardRef(WidgetText)
WidgetText.propTypes = {
  block: PropTypes.bool,
  icon: PropTypes.node,
  onClear: PropTypes.func,
}
WidgetText.deafultProps = {
  icon: ChevronDownVector,
}

export default WidgetText
