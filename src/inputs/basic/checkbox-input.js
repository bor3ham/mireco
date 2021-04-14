import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function CheckboxInput(props) {
  const inputRef = useRef()
  const handleChange = () => {
    if (typeof props.onChange === 'function' && inputRef.current) {
      props.onChange(inputRef.current.checked)
    }
  }
  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={!!props.value}
      onChange={handleChange}
      className={classNames('MIRECO-checkbox-input', props.className)}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
    />
  )
}
CheckboxInput.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,

  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
}

export default CheckboxInput
