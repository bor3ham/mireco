import React from 'react'
import PropTypes from 'prop-types'

import Button from '../inputs/basic/button.js'

const cross = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
  >
    <g
      transform="translate(0,-290.65)"
    >
      <path
        style={{
          fill: 'none',
          stroke: '#333333',
          strokeWidth: '0.66145833',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="m 1.0583333,291.70833 4.2333334,4.23334"
      />
      <path
        style={{
          fill: 'none',
          stroke: '#333333',
          strokeWidth: '0.66145833',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="m 1.0583333,295.94167 4.2333334,-4.23334"
      />
    </g>
  </svg>
)

export default class ClearButton extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  }
  static defaultProps = {
    disabled: false,
  }
  render() {
    return (
      <Button
        tabIndex={-1}
        onClick={this.props.onClick}
        className="MIRECO-clear-button content outline"
        disabled={this.props.disabled}
      >
        &nbsp;
        {cross}
        &nbsp;
      </Button>
    )
  }
}
