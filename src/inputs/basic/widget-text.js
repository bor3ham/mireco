import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import BlockDiv from '../../components/block-div.js'
import Text from './text.js'
import ClearButton from '../../components/clear-button.js'
import ChevronDownVector from '../../components/chevron-down-vector.js'

function WidgetText(props) {
  const { onClear, icon, ...inputProps } = props
  const clearable = typeof onClear === 'function'
  return (
    <BlockDiv block={props.block} className={classNames('MIRECO-widget-text', {
      clearable,
    })}>
      <Text
        {...inputProps}
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
WidgetText.propTypes = {
  block: PropTypes.bool,
  icon: PropTypes.node,
  onClear: PropTypes.func,
}
WidgetText.deafultProps = {
  icon: ChevronDownVector,
}

export default WidgetText
