import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Label extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
  }
  render() {
    return (
      <label
        className={classNames('MIRECO-label', {
          block: this.props.block,
        }, this.props.className)}
        tabIndex={this.props.tabIndex}
      >
        {this.props.children}
      </label>
    )
  }
}

export default Label
