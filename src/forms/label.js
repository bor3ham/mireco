import React from 'react'
import classNames from 'classnames'

class Label extends React.Component {
  render() {
    return (
      <label
        className={classNames('MIRECO-label', this.props.className)}
        tabIndex={this.props.tabIndex}
      >
        {this.props.children}
      </label>
    )
  }
}

export default Label
