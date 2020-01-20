import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Button extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit']),
    name: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,

    children: PropTypes.node,
    block: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }
  static defaultProps = {
    type: 'button',
    tabIndex: 0,
    disabled: false,
  }
  render() {
    return (
      <button
        onClick={this.props.onClick}
        type={this.props.type}
        name={this.props.name}
        value={this.props.value}
        disabled={this.props.disabled}
        autoFocus={this.props.autoFocus}
        tabIndex={this.props.tabIndex}

        className={classNames(
          'MIRECO-button',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    )
  }
}
