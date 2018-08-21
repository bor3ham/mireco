import React from 'react'
import classNames from 'classnames'

class Label extends React.Component {
  render() {
    return (
      <label
        className={classNames('MIRECO-label', this.props.className)}
      >
        {this.props.children}
      </label>
    )
  }
}

export default Label
