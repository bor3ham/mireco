import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Button extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.node,
    name: PropTypes.string,
    block: PropTypes.bool,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
  }
  static defaultProps = {
    type: 'button',
    tabIndex: 0,
    disabled: false,
  }
  render() {
    return (
      <button
        type={this.props.type}
        className={classNames('MIRECO-button', {
          block: this.props.block,
        }, this.props.className)}
        onClick={this.props.onClick}
        name={this.props.name}
        value={this.props.value}
        tabIndex={this.props.tabIndex}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    )
  }
}

export default Button
