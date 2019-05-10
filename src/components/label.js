import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Label extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    children: PropTypes.node,
  }
  render() {
    return (
      <label
        className={classNames(
          'MIRECO-label',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        tabIndex={this.props.tabIndex}
      >
        {this.props.children}
      </label>
    )
  }
}
