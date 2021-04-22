import React from 'react'
import PropTypes from 'prop-types'
import humanizeDuration from 'humanize-duration'
import classNames from 'classnames'
import { format, addMilliseconds, startOfDay, isValid, parse } from 'date-fns'

import { WidgetText, BlockDiv, Dropdown, ClockVector } from '../../components'

function validTime(time) {
  return typeof time === 'number' && !isNaN(time)
}

const shortHumanizeDur = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      h: () => 'h',
      m: () => 'm',
    },
  },
})

export default class Time extends React.PureComponent {
  static propTypes = {
    inputFormats: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    inputFormats: [
      'h:mm:ss a',
      'h:mm:ssa',
      'h:mm:ss',
      'h:mm a',
      'H:mm:ss',
      'H:mm',
      'h:mma',
      'h:mm',
      'h a',
      'H:mm',
      'H',
      'ha',
      'h',
    ],
    longFormat: 'h:mm:ss a',
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
      dropdownOpen: false,
    }
    this.options = this.generateOptions(props)
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.step !== this.props.step
      || prevProps.relativeTo !== this.props.relativeTo
      || prevProps.relativeStart !== this.props.relativeStart
    ) {
      this.options = this.generateOptions(this.props)
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
        label: format(addMilliseconds(startOfDay(new Date()), ms), props.displayFormat),
      }
      if (typeof props.relativeTo === 'number' && typeof props.relativeStart === 'number') {
        let msAbsolute = props.relativeStart + newOption.value
        if (msAbsolute > props.relativeTo) {
          let duration = msAbsolute - props.relativeTo
          if (
            duration <= (24 * 60 * 60 * 1000)
            && duration % (5 * 60 * 1000) === 0
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
    if (typeof value !== 'number') {
      return ''
    }
    let adjustedValue = value
    adjustedValue = addMilliseconds(startOfDay(new Date()), value)
    let longFormatted = format(adjustedValue, props.longFormat)
    let displayFormatted = format(adjustedValue, props.displayFormat)
    let longParsed = this.parseText(longFormatted)
    let shortParsed = this.parseText(displayFormatted)
    if (longParsed === shortParsed) {
      return displayFormatted
    }
    else {
      return longFormatted
    }
  }
  parseText = (textValue) => {
    let trimmed = textValue.trim()
    // todo: remove superfluous spaces
    if (trimmed.length === 0) {
      return null
    }
    let valid = undefined
    this.props.inputFormats.map((format) => {
      if (typeof valid !== 'undefined') {
        return
      }
      let parsed = parse(trimmed, format, startOfDay(new Date()))
      if (isValid(parsed)) {
        valid = +parsed
        valid -= +startOfDay(new Date())
      }
    })
    return valid
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.parseText(newValue), false)
      }
      this.setState({dropdownOpen: true})
    })
  }
  previousOption = () => {
    if (!validTime(this.props.value)) {
      return this.nextOption()
    }
    if (this.props.value === this.options[0].value) {
      return this.options[this.options.length - 1].value
    }
    let nextIndex = 0
    this.options.map((option, index) => {
      if (option.value < this.props.value) {
        nextIndex = index
      }
    })
    return this.options[nextIndex].value
  }
  nextOption = () => {
    if (!validTime(this.props.value)) {
      return this.options[0].value
    }
    let nextIndex = 0
    this.options.map((option, index) => {
      if (option.value <= this.props.value) {
        nextIndex = index
      }
    })
    nextIndex += 1
    if (nextIndex >= this.options.length) {
      nextIndex = 0
    }
    return this.options[nextIndex].value
  }
  handleTextKeyDown = (event) => {
    this.setState({inFocus: true, dropdownOpen: true})
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.nextOption(), false)
        }
        this.setState({dropdownOpen: true})
      }
      if (event.which === 38) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.previousOption(), false)
        }
        this.setState({dropdownOpen: true})
      }
    }
  }
  handleFocus = (event) => {
    this.setState({inFocus: true, dropdownOpen: true})
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
  handleTextClick = () => {
    this.setState({dropdownOpen: true})
  }
  onBlur = () => {
    if (typeof this.props.value === 'number') {
      let formatted = this.format(this.props, this.props.value)
      this.setState({
        textValue: formatted,
        inFocus: false,
        dropdownOpen: false,
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
          dropdownOpen: false,
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
    this.setState({dropdownOpen: false})
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
        <WidgetText
          ref={this.textRef}
          placeholder={this.props.placeholder}
          onChange={this.handleTextChange}
          value={this.state.textValue}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
          block={this.props.block}
          style={{marginBottom: '0'}}
          onClick={this.handleTextClick}
          icon={ClockVector}
        />
        {this.state.inFocus && this.state.dropdownOpen && !this.props.disabled && (
          <Dropdown
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
