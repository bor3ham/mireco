import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Text from './text.js'
import Dropdown from './dropdown.js'

class Time extends React.Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    shortFormat: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    disabled: PropTypes.bool,
  }
  static defaultProps = {
    format: 'HH:mm:ss',
    shortFormat: 'HH:mm',
    placeholder: 'hh:mm',
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: '',
      inFocus: false,
    }
    this.options = this.generateOptions()
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
    this.dropdownRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (typeof this.props.value === 'number') {
        if (this.props.value !== this.parseText(this.state.textValue)) {
          this.setState({textValue: this.format(this.props.value)})
        }
      }
    }
    if (this.props.disabled && !prevProps.disabled) {
      this.handleBlur()
    }
  }
  generateOptions = () => {
    let options = []
    for (var hour = 0; hour < 24; hour++) {
      for (var min = 0; min < 60; min += 15) {
        let ms = (hour * 60 + min) * 60 * 1000
        options.push({
          value: ms,
          label: moment.utc(ms).format(this.props.shortFormat),
        })
      }
    }
    return options
  }
  format = (value) => {
    let parsed = moment.utc(this.props.value)
    let longFormatted = parsed.format(this.props.format)
    let shortFormatted = parsed.format(this.props.shortFormat)
    let longParsed = +moment.utc(longFormatted, this.props.format)
    let shortParsed = +moment.utc(shortFormatted, this.props.format)
    if (longParsed === shortParsed) {
      return shortFormatted
    }
    else {
      return longFormatted
    }
  }
  parseText = (textValue) => {
    let trimmed = textValue.trim()
    if (trimmed.length === 0) {
      return null
    }
    let parsed = moment.utc(trimmed, this.props.format)
    if (parsed.isValid()) {
      return +parsed % +moment.duration({days: 1})
    }
    return undefined
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      this.props.onChange(this.parseText(newValue))
    })
  }
  handleTextKeyDown = (event) => {
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        this.dropdownRef.current && this.dropdownRef.current.selectNext()
      }
      if (event.which === 38) {
        event.preventDefault()
        this.dropdownRef.current && this.dropdownRef.current.selectPrevious()
      }
    }
  }
  handleFocus = (event) => {
    this.setState({inFocus: true})
  }
  handleContainerBlur = (event) => {
    if (
      this.containerRef.current
      && (
        this.containerRef.current.contains(event.relatedTarget)
        || this.containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    this.onBlur()
  }
  onBlur = (event) => {
    if (typeof this.props.value === 'number') {
      let formatted = this.format(this.props.value)
      this.setState({
        textValue: formatted,
        inFocus: false,
      })
    }
    else {
      this.setState({
        textValue: '',
        inFocus: false,
      }, () => {
        this.props.onChange(null)
      })
    }
  }
  handleSelect = (value) => {
    this.props.onChange(value)
    this.textRef.current && this.textRef.current.focus()
  }
  render() {
    return (
      <div
        ref={this.containerRef}
        className="MIRECO-time-container"
        tabIndex={-1}
        onFocus={this.handleContainerFocus}
        onBlur={this.handleContainerBlur}
      >
        <Text
          ref={this.textRef}
          className="MIRECO-time"
          placeholder={this.props.placeholder}
          onChange={this.handleTextChange}
          value={this.state.textValue}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
        />
        {this.state.inFocus && (
          <Dropdown
            ref={this.dropdownRef}
            options={this.options}
            value={this.props.value}
            disabled={this.props.disabled}
            onSelect={this.handleSelect}
            continuousOptions={true}
          />
        )}
      </div>
    )
  }
}
        // {!this.props.disabled && this.state.inFocus && (
        // )}

export default Time
