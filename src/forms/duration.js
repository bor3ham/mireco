import React from 'react'
import PropTypes from 'prop-types'
import humanizeDuration from 'humanize-duration'
import parseDuration from 'parse-duration'
// simplify large units rather than exact
parseDuration.month = parseDuration.week * 4
parseDuration.year = parseDuration.week * 52

import Text from './text.js'

class Duration extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    onChange: PropTypes.func,
    defaultTimeUnit: PropTypes.string,
    placeholder: PropTypes.string,
    incrementUnits: PropTypes.arrayOf(PropTypes.number),
    humanizeUnits: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
  }
  static defaultProps = {
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
  constructor(props) {
    super(props)
    this.state = {
      textValue: this.formatValue(props.value),
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (typeof this.props.value === 'number') {
        if (this.props.value !== this.parseText(this.state.textValue)) {
          this.setState({textValue: this.formatValue(this.props.value)})
        }
      }
    }
  }
  parseText = (value) => {
    let trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    if (trimmed.replace(/[^\d.,-]/g) === trimmed) {
      trimmed += ` ${this.props.defaultTimeUnit}`
    }

    let parsed = Math.floor(parseDuration(trimmed))
    return parsed
  }
  formatValue = (value) => {
    let formatted = ''
    if (typeof value === 'number') {
      formatted = humanizeDuration(value, {
        units: this.props.humanizeUnits,
      })
    }
    return formatted
  }
  bestIncrement = (value, goingUp) => {
    let incIndex = 0
    if (typeof value === 'number') {
      while (
        (
          (goingUp && this.props.value >= this.props.incrementUnits[incIndex + 1])
          || (!goingUp && this.props.value > this.props.incrementUnits[incIndex + 1])
        )
        && incIndex < this.props.incrementUnits.length
      ) {
        incIndex += 1
      }
    }
    return this.props.incrementUnits[incIndex]
  }
  handleTextChange = (newText) => {
    this.setState({textValue: newText}, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.parseText(this.state.textValue), false)
      }
    })
  }
  handleTextKeyDown = (event) => {
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          if (typeof this.props.value === 'number') {
            this.props.onChange(
              Math.max(this.props.value - this.bestIncrement(this.props.value, false), 0)
            )
          }
          else {
            this.props.onChange(0)
          }
        }
      }
      if (event.which === 38) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          if (typeof this.props.value === 'number') {
            this.props.onChange(this.props.value + this.bestIncrement(this.props.value, true))
          }
          else {
            this.props.onChange(this.parseText(`1 ${this.props.defaultTimeUnit}`))
          }
        }
      }
    }
  }
  handleTextBlur = () => {
    this.setState({
      textValue: this.formatValue(this.props.value),
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.props.value, true)
      }
    })
  }
  render() {
    return (
      <Text
        value={this.state.textValue}
        onChange={this.handleTextChange}
        onBlur={this.handleTextBlur}
        block={this.props.block}
        placeholder={this.props.placeholder}
        onKeyDown={this.handleTextKeyDown}
        disabled={this.props.disabled}
      />
    )
  }
}

export default Duration
