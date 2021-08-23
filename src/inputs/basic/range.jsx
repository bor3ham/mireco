import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function Range(props) {
  const inputRef = useRef()
  const handleChange = (event) => {
    if (!inputRef.current) {
      return
    }
    if (typeof props.onChange === 'function') {
      props.onChange(+inputRef.current.value)
    }
  }
  return (
    <input
      ref={inputRef}
      type="range"

      value={props.value}
      onChange={handleChange}
      min={props.min}
      max={props.max}
      step={props.step}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}

      className={classNames(
        'MIRECO-range',
        {
          block: props.block,
        },
        props.className,
      )}
      style={props.style}

      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onClick={props.onClick}
    />
  )
}
Range.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  name: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  tabIndex: PropTypes.number,

  block: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,

  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
}
Range.defaultProps = {
  min: 0,
  max: 100,
}

export default Range
