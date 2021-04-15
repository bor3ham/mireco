import React from 'react'
import PropTypes from 'prop-types'

import Button from '../inputs/basic/button.js'
import CrossVector from './cross-vector.js'

export default class ClearButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  }
  static defaultProps = {
    disabled: false,
  }
  render() {
    return (
      <Button
        tabIndex={-1}
        onClick={this.props.onClick}
        className="MIRECO-clear-button content outline"
        disabled={this.props.disabled}
      >
        &nbsp;
        {CrossVector}
        &nbsp;
      </Button>
    )
  }
}
