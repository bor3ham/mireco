import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Label from './label.js'

const check = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
  >
    <g transform="translate(0,-290.65)">
      <path
        style={{
          fill: 'none',
          strokeWidth: '1.0583',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
        }}
        d="M 1.588,294.090 2.646,295.148 4.763,292.237"
      />
    </g>
  </svg>
)
const unchecked = checked

class Checkbox extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    style: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  handleChange = (event) => {
    this.props.onChange(this.inputRef.current.checked)
  }
  render() {
    return (
      <Label
        className={classNames(
          'MIRECO-checkbox-label', {
            disabled: this.props.disabled,
            block: this.props.block,
          }
        )}
        style={this.props.style}
      >
        <input
          ref={this.inputRef}
          type="checkbox"
          checked={!!this.props.value}
          onChange={this.handleChange}
          name={this.props.name}
          className={classNames('MIRECO-checkbox', this.props.className)}
          disabled={this.props.disabled}
        />
        {check}
        {!!this.props.label && ' '}
        {this.props.label}
      </Label>
    )
  }
}

export default Checkbox
