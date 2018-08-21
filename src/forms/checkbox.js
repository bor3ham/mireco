import React from 'react'
import PropTypes from 'prop-types'

import Label from './label.js'

class Checkbox extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  handleChange = (event) => {
    this.props.onChange(this.inputRef.current.checked)
  }
  render() {
    let check = (
      <input
        ref={this.inputRef}
        type="checkbox"
        checked={!!this.props.value}
        onChange={this.handleChange}
        name={this.props.name}
      />
    )
    if (this.props.label) {
      return (
        <Label>
          {check} {this.props.label}
        </Label>
      )
    }
    return check
  }
}

export default Checkbox
