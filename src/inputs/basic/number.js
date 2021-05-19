import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ARROW_DOWN = 40
const ARROW_UP = 38

function Number(props) {
  const stringify = (value) => {
    if (typeof value === 'number') {
      return `${value}`
    }
    return ''
  }

  const inputRef = useRef()
  const prevValue = useRef()
  const [textValue, setTextValue] = useState(stringify(props.value))
  // const lastValidValue = useRef(typeof props.value === 'number' ? props.value : null)
  // useEffect(() => {
  //   if (typeof props.value === 'number') {
  //     lastValidValue.current = props.value
  //   }
  // }, [props.value])

  const parse = (textValue) => {
    const trimmed = textValue.trim()
    if (trimmed.length === 0) {
      return null
    }
    const parsed = parseFloat(trimmed)
    if (isNaN(parsed)) {
      return undefined
    }
    if (typeof props.step === 'number') {
      if (parsed % props.step !== 0) {
        return undefined
      }
    }
    if (typeof props.min === 'number' && parsed < props.min) {
      // lastValidValue.current = props.min
      // if (typeof props.step === 'number') {
      //   lastValidValue.current -= props.min % props.step
      // }
      return undefined
    }
    if (typeof props.max === 'number' && parsed > props.max) {
      // lastValidValue.current = props.max
      // if (typeof props.step === 'number') {
      //   lastValidValue.current -= props.max % props.step
      // }
      return undefined
    }
    return parsed
  }

  useEffect(() => {
    if (typeof props.value !== 'undefined' && parse(textValue) != props.value) {
      setTextValue(stringify(props.value))
    }
  }, [props.value])
  prevValue.current = props.value

  const handleKeyDown = (event) => {
    if (event) {
      if (event.which === ARROW_DOWN || event.which === ARROW_UP) {
        event.preventDefault()
        if (typeof props.onChange !== 'function') {
          return
        }
        const current = typeof props.value === 'number' ? props.value : 0
        const step = typeof props.step === 'number' ? props.step : 1
        if (event.which === ARROW_UP) {
          const next = current + step
          if (typeof props.max !== 'number' || next <= props.max) {
            props.onChange(next)
          }
        }
        if (event.which === ARROW_DOWN) {
          const next = current - step
          if (typeof props.min !== 'number' || next >= props.min) {
            props.onChange(next)
          }
        }
      }
    }
    if (typeof props.onKeyDown === 'function') {
      props.onKeyDown(event)
    }
  }
  const handleChange = (event) => {
    if (typeof props.onChange === 'function') {
      const newValue = inputRef.current.value
      setTextValue(newValue)
      props.onChange(parse(newValue))
    }
  }
  const handleBlur = (event) => {
    // if (typeof props.value !== 'undefined') {
    const stringified = stringify(props.value)
    setTextValue(stringified)
    // } else {
    //   props.onChange(lastValidValue.current)
    // }
    if (typeof props.onBlur === 'function') {
      props.onBlur(event)
    }
  }

  return (
    <input
      ref={inputRef}

      value={textValue}
      onChange={handleChange}
      type="text"
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
      onKeyDown={handleKeyDown}
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
  min: PropTypes.number,
  max: PropTypes.number,

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
