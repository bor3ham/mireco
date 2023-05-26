import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import humanizeDuration from 'humanize-duration'
import parseDuration from 'parse-duration'
// simplify large units rather than exact
parseDuration.month = parseDuration.week * 4
parseDuration.year = parseDuration.week * 52

import { WidgetText } from 'components'
import { HourglassVector } from 'vectors'
import { usePrevious } from '../../hooks'

const ARROW_DOWN = 40
const ARROW_UP = 38

function Duration(props) {
  const formatValue = (value) => {
    let formatted = ''
    if (typeof value === 'number') {
      formatted = humanizeDuration(value, {
        units: props.humanizeUnits,
      })
    }
    return formatted
  }
  const parseText = (value) => {
    let trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    if (trimmed.replace(/[^\d.,-]/g) === trimmed) {
      trimmed += ` ${props.defaultTimeUnit}`
    }

    const parsed = parseDuration(trimmed)
    if (parsed === 0 && trimmed[0] !== '0') {
      return undefined
    }
    return Math.floor(parsed)
  }
  const [textValue, setTextValue] = useState(formatValue(props.value))

  // on component received new props
  const prevProps = usePrevious(props)
  useEffect(() => {
    if (!prevProps) {
      return
    }
    if (prevProps.value !== props.value ) {
      if (props.value === null) {
        setTextValue('')
      }
      else if (typeof props.value === 'number') {
        if (props.value !== parseText(textValue)) {
          setTextValue(formatValue(props.value))
        }
      }
    }
  }, [props.value])

  const bestIncrement = (value, goingUp) => {
    let incIndex = 0
    if (typeof value === 'number') {
      while (
        (
          (goingUp && props.value >= props.incrementUnits[incIndex + 1])
          || (!goingUp && props.value > props.incrementUnits[incIndex + 1])
        )
        && incIndex < props.incrementUnits.length
      ) {
        incIndex += 1
      }
    }
    return props.incrementUnits[incIndex]
  }
  const handleTextChange = (newText) => {
    setTextValue(newText)
    if (typeof props.onChange === 'function') {
      props.onChange(parseText(newText), false)
    }
  }
  const handleTextKeyDown = (event) => {
    if (event) {
      if (event.which === ARROW_DOWN) {
        event.preventDefault()
        if (typeof props.onChange === 'function') {
          if (typeof props.value === 'number') {
            props.onChange(
              Math.max(props.value - bestIncrement(props.value, false), 0)
            )
          }
          else {
            props.onChange(0)
          }
        }
      }
      if (event.which === ARROW_UP) {
        event.preventDefault()
        if (typeof props.onChange === 'function') {
          if (typeof props.value === 'number') {
            props.onChange(props.value + bestIncrement(props.value, true))
          }
          else {
            props.onChange(parseText(`1 ${props.defaultTimeUnit}`))
          }
        }
      }
    }
  }
  const handleTextBlur = () => {
    setTextValue(formatValue(props.value))
    if (typeof props.onChange === 'function') {
      props.onChange(props.value, true)
    }
  }
  return (
    <WidgetText
      id={props.id}
      value={textValue}
      onChange={handleTextChange}
      onBlur={handleTextBlur}
      block={props.block}
      placeholder={props.placeholder}
      onKeyDown={handleTextKeyDown}
      disabled={props.disabled}
      className={classNames(
        'MIRECO-duration',
        props.className,
      )}
      icon={HourglassVector}
    />
  )
}
Duration.propTypes = {
  block: PropTypes.bool,
  onChange: PropTypes.func,
  defaultTimeUnit: PropTypes.string,
  placeholder: PropTypes.string,
  incrementUnits: PropTypes.arrayOf(PropTypes.number),
  humanizeUnits: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.number,
  id: PropTypes.string,
}
Duration.defaultProps = {
  block: false,
  defaultTimeUnit: 'hours',
  placeholder: 'Duration',
  incrementUnits: [
    // 1000, // seconds
    60 * 1000, // minutes
    60 * 60 * 1000, // hours
    24 * 60 * 60 * 1000, // days
    // 7 * 24 * 60 * 60 * 1000, // weeks
    // (365.25 * 24 * 60 * 60 * 1000) / 12, // months
  ],
  humanizeUnits: [
    'w',
    'd',
    'h',
    'm',
    's',
  ],
  disabled: false,
}

export default Duration
