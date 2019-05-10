import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import humanizeDuration from 'humanize-duration'
import classNames from 'classnames'

import { Text } from 'inputs'
import { Dropdown, BlockDiv } from 'components'

const shortHumanizeDur = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      h: () => 'h',
      m: () => 'm',
    },
  },
})

export default class Time extends React.Component {
  static propTypes = {
    inputFormat: PropTypes.string.isRequired,
    displayFormat: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    step: PropTypes.number.isRequired,
    block: PropTypes.bool,
    autoErase: PropTypes.bool,
    className: PropTypes.string,
    relativeTo: PropTypes.number,
    relativeStart: PropTypes.number,
    rightHang: PropTypes.bool,
  }
  static defaultProps = {
    inputFormat: 'h:mm:ss a',
    displayFormat: 'h:mm a',
    placeholder: 'hh:mm',
    step: 30,
    autoErase: true,
    relativeStart: 0,
    rightHang: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: this.format(props, props.value),
      inFocus: false,
    }
    this.options = this.generateOptions(props)
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
    this.dropdownRef = React.createRef()
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.step != this.props.step
      || prevProps.relativeTo != this.props.relativeTo
      || prevProps.relativeStart != this.props.relativeStart
    ) {
      this.options = this.generateOptions(prevProps)
    }
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
  generateOptions = (props) => {
    let options = []
    for (var min = 0; min < 24 * 60; min += props.step) {
      let ms = min * 60 * 1000
      let newOption = {
        value: ms,
        label: moment.utc(ms).format(props.displayFormat),
      }
      if (typeof props.relativeTo === 'number') {
        let msAbsolute = props.relativeStart + newOption.value
        if (msAbsolute > props.relativeTo) {
          let duration = msAbsolute - props.relativeTo
          if (
            duration <= +moment.duration({hours: 24})
            && duration % +moment.duration({minutes: 5}) === 0
          ) {
            newOption.label += ` (${shortHumanizeDur(duration, {
              units: ['h', 'm'],
              spacer: '',
            })})`
          }
        }
      }
      options.push(newOption)
    }
    return options
  }
  format = (props, value) => {
    if (value === null || typeof value === 'undefined') {
      return ''
    }
    let parsed = moment.utc(value)
    let longFormatted = parsed.format(props.inputFormat)
    let displayFormatted = parsed.format(props.displayFormat)
    let longParsed = +moment.utc(longFormatted, props.inputFormat)
    let shortParsed = +moment.utc(displayFormatted, props.inputFormat)
    if (longParsed === shortParsed) {
      return displayFormatted
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
    let parsed = moment.utc(trimmed, this.props.inputFormat)
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
      && this.containerRef.current.divRef.current
      && (
        this.containerRef.current.divRef.current.contains(event.relatedTarget)
        || this.containerRef.current.divRef.current === event.relatedTarget
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
      <BlockDiv
        ref={this.containerRef}
        className={classNames(
          'MIRECO-time',
          {
            'right-hang': this.props.rightHang,
          },
          this.props.className,
        )}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
        block={this.props.block}
      >
        <Text
          ref={this.textRef}
          placeholder={this.props.placeholder}
          onChange={this.handleTextChange}
          value={this.state.textValue}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
          block={this.props.block}
          style={{marginBottom: '0'}}
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
      </BlockDiv>
    )
  }
}
