import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { parse, format, isValid, startOfDay, addDays, subDays } from 'date-fns'

import { Text } from 'inputs'
import { Calendar, BlockDiv } from 'components'

export default class MirecoDate extends React.Component {
  static propTypes = {
    inputFormats: PropTypes.arrayOf(PropTypes.string).isRequired,
    displayFormat: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    autoErase: PropTypes.bool,
    rightHang: PropTypes.bool,
    className: PropTypes.string,
  }
  static defaultProps = {
    block: false,
    inputFormats: [
      'd',
      'do',
      'd/MM',
      'do MMM',
      'do MMMM',
      'd/MM/yy',
      'd/MM/yyyy',
      'do MMM yy',
      'do MMM yyyy',
      'do MMMM yy',
      'do MMMM yyyy',
    ],
    displayFormat: 'do MMM yyyy',
    placeholder: 'dd/mm/yyyy',
    autoErase: true,
    rightHang: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: this.format(props, props.value),
      inFocus: false,
    }
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
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
  format(props, value) {
    if (value === null || typeof value === 'undefined') {
      return ''
    }
    return format(value, props.displayFormat)
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
      let parsed = parse(trimmed, format, new Date())
      if (isValid(parsed)) {
        valid = +startOfDay(parsed) - (parsed.getTimezoneOffset() * 60000)
      }
    })
    return valid
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
  handleTextKeyDown = (event) => {
    this.setState({inFocus: true})
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        let current = (typeof this.props.value === 'number') ? this.props.value : +startOfDay(new Date())
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(+addDays(current, 1), false)
        }
      }
      if (event.which === 38) {
        event.preventDefault()
        let current = (typeof this.props.value === 'number') ? this.props.value : +startOfDay(new Date())
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(+subDays(current, 1), false)
        }
      }
    }
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.parseText(newValue), false)
      }
    })
  }
  onSelectDay = (day) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(day, false)
    }
    this.textRef.current && this.textRef.current.focus()
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
  render() {
    return (
      <BlockDiv
        ref={this.containerRef}
        block={this.props.block}
        className={classNames(
          'MIRECO-date',
          {
            'right-hang': this.props.rightHang,
          },
          this.props.className,
        )}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        <Text
          ref={this.textRef}
          placeholder={this.props.placeholder}
          value={this.state.textValue}
          onChange={this.handleTextChange}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
          block={this.props.block}
          style={{marginBottom: '0'}}
        />
        {this.state.inFocus && !this.props.disabled && (
          <Calendar
            selectDay={this.onSelectDay}
            current={this.props.value}
          />
        )}
      </BlockDiv>
    )
  }
}
