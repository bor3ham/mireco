import React from 'react'
import PropTypes from 'prop-types'

import Button from '../button.js'

const cross = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 7.9375 7.9375"
  >
    <g
      id="layer1"
      transform="translate(0,-289.0625)"
    >
      <path
        style={{
          fill: 'none',
          stroke: '#333333',
          strokeWidth: '0.79375',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="m 1.8520833,290.91458 4.2333334,4.23334"
        id="path817"
      />
      <path
        style={{
          fill: 'none',
          stroke: '#333333',
          strokeWidth: '0.79375',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="m 1.8520833,295.14792 4.2333334,-4.23334"
        id="path819"
      />
    </g>
  </svg>
)

class ClearButton extends React.Component {
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
        className="MIRECO-clear-button"
        disabled={this.props.disabled}
      >
        &nbsp;
        {cross}
        &nbsp;
      </Button>
    )
  }
}

export default ClearButton
