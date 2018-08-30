import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'

import Text from './text.js'
import { Dropdown } from './components'

class Time extends React.Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    shortFormat: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    step: PropTypes.number.isRequired,
    block: PropTypes.bool,
    autoErase: PropTypes.bool,
  }
  static defaultProps = {
    format: 'HH:mm:ss',
    shortFormat: 'HH:mm',
    placeholder: 'hh:mm',
    step: 30,
    autoErase: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: this.format(props, props.value),
      inFocus: false,
    }
    this.options = this.generateOptions(props.step)
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
    this.dropdownRef = React.createRef()
  }
  componentWillUpdate = (nextProps, nextState) => {
    if (nextProps.step != this.props.step) {
      this.options = this.generateOptions(nextProps.step)
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (typeof this.props.value === 'number') {
        if (this.props.value !== this.parseText(this.state.textValue)) {
          this.setState({textValue: this.format(this.props, this.props.value)})
        }
      }
    }
    if (this.props.disabled && !prevProps.disabled) {
      this.onBlur()
    }
  }
  generateOptions = (step) => {
    let options = []
    for (var min = 0; min < 24 * 60; min += step) {
      let ms = min * 60 * 1000
      options.push({
        value: ms,
        label: moment.utc(ms).format(this.props.shortFormat),
      })
    }
    return options
  }
  format = (props, value) => {
    if (value === null || typeof value === 'undefined') {
      return ''
    }
    let parsed = moment.utc(value)
    let longFormatted = parsed.format(props.format)
    let shortFormatted = parsed.format(props.shortFormat)
    let longParsed = +moment.utc(longFormatted, props.format)
    let shortParsed = +moment.utc(shortFormatted, props.format)
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
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.parseText(newValue), false)
      }
    })
  }
  handleTextKeyDown = (event) => {
    this.setState({inFocus: true})
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
  onBlur = () => {
    if (typeof this.props.value === 'number') {
      let formatted = this.format(this.props, this.props.value)
      this.setState({
        textValue: formatted,
        inFocus: false,
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.props.value, true)
        }
      })
    }
    else {
      this.setState(prevState => {
        let updates = {
          inFocus: false,
        }
        if (this.props.autoErase) {
          updates.textValue = ''
        }
        return updates
      }, () => {
        if (typeof this.props.onChange === 'function') {
          if (this.props.autoErase) {
            this.props.onChange(null, true)
          }
          else {
            this.props.onChange(this.props.value, true)
          }
        }
      })
    }
  }
  handleSelect = (value) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, false)
    }
    this.textRef.current && this.textRef.current.focus()
  }
  render() {
    return (
      <div
        ref={this.containerRef}
        className={classNames("MIRECO-time", {
          block: this.props.block,
        })}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
        style={{
          display: 'inline-block',
        }}
      >
        <Text
          ref={this.textRef}
          placeholder={this.props.placeholder}
          onChange={this.handleTextChange}
          value={this.state.textValue}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
        />
        {this.state.inFocus && !this.props.disabled && (
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

export default Time
