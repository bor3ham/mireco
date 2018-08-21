import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Button extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.node,
    name: PropTypes.string,
  }
  static defaultProps = {
    type: 'button',
  }
  render() {
    return (
      <button
        type={this.props.type}
        className={classNames('MIRECO-button', this.props.className)}
        onClick={this.props.onClick}
        name={this.props.name}
        value={this.props.value}
      >
        {this.props.children}
      </button>
    )
  }
}

export default Button
