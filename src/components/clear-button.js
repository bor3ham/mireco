import React from 'react'
import PropTypes from 'prop-types'

import Button from '../inputs/basic/button.js'
import CrossVector from './cross-vector.js'

function ClearButton(props) {
  return (
    <Button
      tabIndex={-1}
      onClick={props.onClick}
      className="MIRECO-clear-button content outline"
      disabled={props.disabled}
    >
      &nbsp;
      {CrossVector}
      &nbsp;
    </Button>
  )
}
ClearButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}
ClearButton.defaultProps = {
  disabled: false,
}

export default ClearButton
