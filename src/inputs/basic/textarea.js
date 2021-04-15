import React from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'
import classNames from 'classnames'

export default class Textarea extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    tabIndex: PropTypes.number,
    maxLength: PropTypes.number,
    id: PropTypes.string,

    block: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    minRows: PropTypes.number,
    maxRows: PropTypes.number,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
  }
  static defaultProps = {
    minRows: 2,
    maxRows: 5,
  }
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.disabled && !prevProps.disabled
      && this.inputRef.current
      && this.inputRef.current._ref === document.activeElement
      && typeof this.props.onBlur === 'function'
    ) {
      this.props.onBlur()
    }
    if (
      !this.props.disabled && prevProps.disabled
      && this.inputRef.current
      && this.inputRef.current._ref === document.activeElement
      && typeof this.props.onFocus === 'function'
    ) {
      this.props.onFocus()
    }
  }
  handleChange = (event) => {
    if (event && typeof this.props.onChange === 'function') {
      this.props.onChange(event.target.value)
    }
  }
  render() {
    return (
      <TextareaAutosize
        ref={this.inputRef}

        value={this.props.value || ''}
        onChange={this.handleChange}
        name={this.props.name}
        required={this.props.required}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        autoFocus={this.props.autoFocus}
        tabIndex={this.props.tabIndex}
        maxLength={this.props.maxLength}
        id={this.props.id}

        className={classNames(
          'MIRECO-textarea',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        style={this.props.style}
        minRows={this.props.minRows || 1}
        maxRows={this.props.maxRows}

        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onKeyDown}
        onKeyUp={this.props.onKeyUp}
      />
    )
  }
}
