import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Label from './label.js'

const check = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.3499999 6.3500002"
  >
    <g transform="translate(0,-290.64998)">
      <path
        style={{
          fill: 'none',
          strokeWidth: '1.05833333',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
        }}
        d="M 1.5875,294.08956 2.6458333,295.1479 4.7625,292.23748"
      />
    </g>
  </svg>
)
const unchecked = checked

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
    return (
      <Label>
        <input
          ref={this.inputRef}
          type="checkbox"
          checked={!!this.props.value}
          onChange={this.handleChange}
          name={this.props.name}
          className={classNames('MIRECO-checkbox', this.props.className)}
        />
        {check}
        {!!this.props.label && ' '}
        {this.props.label}
      </Label>
    )
  }
}

export default Checkbox
