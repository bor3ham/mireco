import React from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'
import classNames from 'classnames'

class Textarea extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    minRows: PropTypes.number.isRequired,
    maxRows: PropTypes.number,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    block: PropTypes.bool,
  }
  static defaultProps = {
    minRows: 2,
    maxRows: 5,
  }
  handleChange = (event) => {
    if (event && typeof this.props.onChange === 'function') {
      this.props.onChange(event.target.value)
    }
  }
  render() {
    return (
      <TextareaAutosize
        value={this.props.value || ''}
        onChange={this.handleChange}
        className={classNames('MIRECO-textarea', {
          block: this.props.block,
        }, this.props.className)}
        minRows={this.props.minRows}
        maxRows={this.props.maxRows}
        placeholder={this.props.placeholder}
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

export default Textarea
