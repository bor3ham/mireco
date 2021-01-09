import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function Number(props) {
  const parse = (textValue) => {
    const trimmed = textValue.trim()
    if (trimmed.length === 0) {
      return null
    }
    const parsed = parseFloat(trimmed)
    if (isNaN(parsed)) {
      return undefined
    }
    return parsed
  }
  const stringify = (value) => {
    if (typeof value === 'number') {
      return `${value}`
    }
    return ''
  }

  const inputRef = useRef()
  const prevValue = useRef()
  const [textValue, setTextValue] = useState(stringify(props.value))

  useEffect(() => {
    if (typeof props.value !== 'undefined' && parse(textValue) != props.value) {
      setTextValue(stringify(props.value))
    }
  }, [props.value])
  prevValue.current = props.value

  const handleChange = (event) => {
    if (typeof props.onChange === 'function') {
      const newValue = inputRef.current.value
      setTextValue(newValue)
      props.onChange(parse(newValue))
    }
  }
  const handleBlur = () => {
    setTextValue(stringify(props.value))
    if (typeof props.onBlur === 'function') {
      props.onBlur()
    }
  }

  return (
    <input
      ref={inputRef}

      value={textValue}
      onChange={handleChange}
      type="number"
      name={props.name}
      required={props.required}
      placeholder={props.placeholder || ''}
      disabled={props.disabled}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}
      step={props.step}

      className={classNames(
        'MIRECO-number',
        {
          block: props.block,
          sized: !!props.size,
        },
        props.className,
      )}
      style={props.style}
      size={props.size}

      onFocus={props.onFocus}
      onBlur={handleBlur}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      onClick={props.onClick}
    />
  )
}
Number.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  name: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  tabIndex: PropTypes.number,
  step: PropTypes.number,

  block: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.number,

  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func,
}
Number.defaultProps = {
  type: 'text',
}

export default Number
