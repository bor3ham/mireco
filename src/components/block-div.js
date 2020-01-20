import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class BlockDiv extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    block: PropTypes.bool,
    className: PropTypes.string,
    inlineDisplay: PropTypes.string,
  }
  static defaultProps = {
    inlineDisplay: 'inline-block',
  }
  constructor(props) {
    super(props)
    this.divRef = React.createRef()
  }
  render() {
    let style = {}
    if (!this.props.block) {
      style.display = this.props.inlineDisplay
    }
    style = {
      ...style,
      ...this.props.style,
    }
    const divProps = {
      ...this.props,
    }
    if ('block' in divProps) {
      delete divProps['block']
    }
    if ('inlineDisplay' in divProps) {
      delete divProps['inlineDisplay']
    }
    return (
      <div
        {...divProps}
        ref={this.divRef}
        style={style}
        className={classNames(this.props.className, {
          block: this.props.block,
        })}
      >
        {this.props.children}
      </div>
    )
  }
}
