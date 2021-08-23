import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Text from './text.jsx'

const ARROW_DOWN = 40
const ARROW_UP = 38

function MirecoNumber(props) {
  const stringify = (value) => {
    if (typeof value === 'number') {
      return `${value}`
    }
    return ''
  }

  const {step, min, max, ...inputProps} = props

  const prevValue = useRef()
  const [textValue, setTextValue] = useState(stringify(props.value))

  const parse = (textValue) => {
    const trimmed = textValue.trim()
    if (trimmed.length === 0) {
      return null
    }
    const parsed = parseFloat(trimmed)
    if (isNaN(parsed)) {
      return undefined
    }
    if (typeof step === 'number') {
      if (parsed % step !== 0) {
        return undefined
      }
    }
    if (typeof min === 'number' && parsed < min) {
      return undefined
    }
    if (typeof max === 'number' && parsed > max) {
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
        const currentStep = typeof step === 'number' ? step : 1
        if (event.which === ARROW_UP) {
          const next = current + currentStep
          if (typeof max !== 'number' || next <= max) {
            props.onChange(next)
          }
        }
        if (event.which === ARROW_DOWN) {
          const next = current - currentStep
          if (typeof min !== 'number' || next >= min) {
            props.onChange(next)
          }
        }
      }
    }
    if (typeof props.onKeyDown === 'function') {
      props.onKeyDown(event)
    }
  }
  const handleChange = (newValue) => {
    if (typeof props.onChange === 'function') {
      setTextValue(newValue)
      props.onChange(parse(newValue))
    }
  }
  const handleBlur = (event) => {
    const stringified = stringify(props.value)
    setTextValue(stringified)
    if (typeof props.onBlur === 'function') {
      props.onBlur(event)
    }
  }

  return (
    <Text
      {...inputProps}
      value={textValue}
      onChange={handleChange}
      className={classNames(
        'MIRECO-number',
        props.className,
      )}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  )
}
MirecoNumber.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,

  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
}
MirecoNumber.defaultProps = {
  type: 'text',
}

export default MirecoNumber
