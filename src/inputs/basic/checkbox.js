import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Label from '../../components/label.js'
import CheckboxInput from './checkbox-input.js'

const check = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 6.35 6.35"
    style={{display: 'none'}}
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

function Checkbox(props) {
  return (
    <Label
      className={classNames(
        'MIRECO-checkbox',
        {
          disabled: props.disabled,
        },
        props.className,
      )}
      style={props.style}
      block={props.block}
    >
      <CheckboxInput
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        id={props.id}
      />
      {check}
      {!!props.label && ' '}
      {!!props.label && (<span>{props.label}</span>)}
    </Label>
  )
}
Checkbox.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,

  block: PropTypes.bool,
  label: PropTypes.string,

  id: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
}

export default Checkbox
