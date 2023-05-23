import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../inputs/basic/button'
import CrossVector from './cross-vector'

function ClearButton(props) {
  return (
    <Button
      tabIndex={-1}
      onClick={props.onClick}
      className={classNames('MIRECO-clear-button content outline', props.className)}
      disabled={props.disabled}
    >
      {props.spaced && (<>&nbsp;</>)}
      {CrossVector}
      {props.spaced && (<>&nbsp;</>)}
    </Button>
  )
}
ClearButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  spaced: PropTypes.bool,
}
ClearButton.defaultProps = {
  disabled: false,
  spaced: true,
}

export default ClearButton
