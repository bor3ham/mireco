import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Text extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    block: PropTypes.bool,
    className: PropTypes.string,
  }
  static defaultProps = {
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
        type="text"
        value={this.props.value}
        onChange={this.handleChange}
        className={classNames(
          'MIRECO-text',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        placeholder={this.props.placeholder || ''}
        name={this.props.name}
        disabled={this.props.disabled}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
      />
    )
  }
}

export default Text
