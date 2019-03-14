import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Text extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.oneOf(['text', 'password', 'email']),
    name: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,
    maxLength: PropTypes.number,

    block: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.number,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
  }
  static defaultProps = {
    type: 'text',
  }
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  handleChange = (event) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.inputRef.current.value)
    }
  }
  focus() {
    this.inputRef.current && this.inputRef.current.focus()
  }
  render() {
    return (
      <input
        ref={this.inputRef}
        type={this.props.type}

        value={this.props.value}
        onChange={this.handleChange}
        name={this.props.name}
        placeholder={this.props.placeholder || ''}
        disabled={this.props.disabled}
        autoFocus={this.props.autoFocus}
        tabIndex={this.props.tabIndex}
        maxLength={this.props.maxLength}

        className={classNames(
          'MIRECO-text',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        style={this.props.style}
        size={this.props.size}

        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
      />
    )
  }
}

export default Text
