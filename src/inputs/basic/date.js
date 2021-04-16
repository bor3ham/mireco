import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { parse, format, isValid, addDays, subDays } from 'date-fns'

import Calendar from '../../components/calendar.js'
import BlockDiv from '../../components/block-div.js'
import { propTypes as mirecoPropTypes, constants } from 'utilities'
import ChevronDownVector from '../../components/chevron-down-vector.js'
import WidgetText from './widget-text.js'

export default class MirecoDate extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    inputFormats: PropTypes.arrayOf(PropTypes.string).isRequired,
    displayFormat: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: mirecoPropTypes.date,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    autoErase: PropTypes.bool,
    rightHang: PropTypes.bool,
    className: PropTypes.string,
    textClassName: PropTypes.string,
    required: PropTypes.bool,
    icon: PropTypes.node,
    showClearButton: PropTypes.bool,
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
    required: false,
    icon: ChevronDownVector,
    showClearButton: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: this.format(props, props.value),
      inFocus: false,
      calendarOpen: false,
    }
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (typeof this.props.value === 'string') {
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
    return format(parse(value, constants.ISO_8601_DATE_FORMAT, new Date()), props.displayFormat)
  }
  parseText = (textValue) => {
    let trimmed = textValue.trim()
    // todo: remove superfluous spaces
    if (trimmed.length === 0) {
      return null
    }

    let valid = undefined
    this.props.inputFormats.map((inputFormat) => {
      if (typeof valid !== 'undefined') {
        return
      }
      let parsed = parse(trimmed, inputFormat, new Date())
      if (isValid(parsed)) {
        // console.log(textValue, 'valid format:', format, this.format(this.props, +parsed))
        valid = format(parsed, constants.ISO_8601_DATE_FORMAT)
      }
    })
    return valid
  }
  handleFocus = (event) => {
    this.setState({
      inFocus: true,
      calendarOpen: true,
    })
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
  handleTextKeyDown = (event) => {
    this.setState({inFocus: true, calendarOpen: true})
    if (event) {
      let current = new Date()
      if (typeof this.props.value === 'string') {
        current = parse(this.props.value, constants.ISO_8601_DATE_FORMAT, new Date())
      }
      if (event.which === 40) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(format(addDays(current, 1), constants.ISO_8601_DATE_FORMAT), false)
        }
        this.setState({calendarOpen: true})
      }
      if (event.which === 38) {
        event.preventDefault()
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(format(subDays(current, 1), constants.ISO_8601_DATE_FORMAT), false)
        }
        this.setState({calendarOpen: true})
      }
    }
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.parseText(newValue), false)
      }
      this.setState({calendarOpen: true})
    })
  }
  handleTextClick = () => {
    this.setState({calendarOpen: true})
  }
  onSelectDay = (day) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(day, false)
    }
    this.textRef.current && this.textRef.current.focus()
    this.setState({calendarOpen: false})
  }
  onBlur = () => {
    if (typeof this.props.value === 'string') {
      let formatted = this.format(this.props, this.props.value)
      this.setState({
        textValue: formatted,
        inFocus: false,
        calendarOpen: false,
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
          calendarOpen: false,
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
  focus = () => {
    if (this.textRef.current) {
      this.textRef.current.focus()
    }
  }
  onClear = () => {
    this.props.onChange(null, false)
  }
  render() {
    const clearable = typeof this.props.value === 'string' && this.props.showClearButton
    return (
      <BlockDiv
        ref={this.containerRef}
        block={this.props.block}
        className={classNames(
          'MIRECO-date',
          {
            'right-hang': this.props.rightHang,
            clearable,
          },
          this.props.className,
        )}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        <WidgetText
          id={this.props.id}
          ref={this.textRef}
          placeholder={this.props.placeholder}
          value={this.state.textValue}
          onChange={this.handleTextChange}
          onClick={this.handleTextClick}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
          block={this.props.block}
          style={{marginBottom: '0'}}
          required={this.props.required}
          className={this.props.textClassName}
          icon={this.props.icon}
          onClear={clearable ? this.onClear : undefined}
        />
        {this.state.inFocus && this.state.calendarOpen && !this.props.disabled && (
          <Calendar
            selectDay={this.onSelectDay}
            current={this.props.value}
          />
        )}
      </BlockDiv>
    )
  }
}
