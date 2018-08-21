import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Text extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
  }
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  handleChange = (event) => {
    this.props.onChange(this.inputRef.current.value)
  }
  render() {
    return (
      <input
        ref={this.inputRef}
        type="text"
        value={this.props.value}
        onChange={this.handleChange}
        className={classNames('MIRECO-text', this.props.className)}
        placeholder={this.props.placeholder || ''}
        name={this.props.name}
      />
    )
  }
}

export default Text
