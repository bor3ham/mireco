import React from 'react'
import PropTypes from 'prop-types'
import { startOfDay, format, parse } from 'date-fns'
import classNames from 'classnames'

import { Date as DateInput } from '../basic/date'
import { Time } from '../basic/time'
import { BlockDiv, ClearButton } from 'components'
import { ISO_8601_DATE_FORMAT } from '../../constants'
import { datePropType } from '../../prop-types-old/date'

function validDate(date) {
  return typeof date === 'string'
}
function validDatetime(datetime) {
  return (typeof datetime === 'number' && !isNaN(datetime))
}
function datetimesEqual(datetime1, datetime2) {
  return (datetime1 === datetime2)
}
function datetimeNull(datetime) {
  return (datetime === null)
}
function dateNull(date) {
  return (date === null)
}
function dateAsMs(date) {
  return +parse(date, ISO_8601_DATE_FORMAT, new Date())
}
function combineDateTime(date, time) {
  return +startOfDay(parse(date, ISO_8601_DATE_FORMAT, new Date())) + time
}
function splitDateTime(value) {
  if (value === null) {
    return {
      date: null,
      time: null,
    }
  }
  if (validDatetime(value)) {
    const date = format(value, ISO_8601_DATE_FORMAT)
    const time = value - dateAsMs(date)
    return {
      date,
      time,
    }
  }
  return {
    date: undefined,
    time: undefined,
  }
}

export default class Datetime extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    timeFirst: PropTypes.bool,
    showClear: PropTypes.bool,
    className: PropTypes.string,
    relativeTo: PropTypes.number,
    defaultDate: datePropType,
    dateTextClassName: PropTypes.string,
    timeTextClassName: PropTypes.string,
    clearButtonClassName: PropTypes.string,
    id: PropTypes.string,
  }
  static defaultProps = {
    block: false,
    timeFirst: false,
    showClear: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...splitDateTime(props.value),
    }
    this.containerRef = React.createRef()
    this.dateRef = React.createRef()
    this.timeRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (!datetimesEqual(prevProps.value, this.props.value)) {
      if (datetimeNull(this.props.value)) {
        this.setState({
          date: null,
          time: null,
        })
      }
      else if (validDatetime(this.props.value)) {
        if (!datetimesEqual(this.props.value, this.combinedStateValue())) {
          this.setState({
            ...splitDateTime(this.props.value),
          })
        }
      }
    }
  }
  getDefaultDate() {
    if (this.props.defaultDate) {
      return this.props.defaultDate
    }
    return format(new Date(), ISO_8601_DATE_FORMAT)
  }
  combinedStateValue() {
    return combineDateTime(
      this.state.date || this.getDefaultDate(),
      this.state.time || 0
    )
  }
  handleDateChange = (newDate, wasBlur) => {
    this.setState({date: newDate}, this.updateParentValue)
  }
  handleTimeChange = (newTime, wasBlur) => {
    this.setState({time: newTime}, this.updateParentValue)
  }
  updateParentValue = () => {
    if (typeof this.props.onChange === 'function') {
      if (dateNull(this.state.date) && datetimeNull(this.state.time)) {
        this.props.onChange(null, false)
      }
      else if (
        validDate(this.state.date)
        || validDatetime(this.state.time)
      ) {
        this.props.onChange(this.combinedStateValue(), false)
      }
      else {
        this.props.onChange(undefined, false)
      }
    }
  }
  handleContainerBlur = (event) => {
    if (event.relatedTarget) {
      const containedInDate = (
        this.dateRef.current
        && this.dateRef.current.containerRef.current
        && (
          this.dateRef.current.containerRef.current.contains(
            event.relatedTarget
          )
          || this.dateRef.current.containerRef.current == event.relatedTarget
        )
      )
      const containedInTime = (
        this.timeRef.current
        && this.timeRef.current.containerRef.current
        && (
          this.timeRef.current.containerRef.current.contains(
            event.relatedTarget
          )
          || this.timeRef.current.containerRef.current == event.relatedTarget
        )
      )
      if (containedInDate || containedInTime) {
        // ignore internal blur
        return
      }
    }
    this.onBlur()
  }
  handleClearClick = (event) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(null, true)
    }
  }
  onBlur = () => {
    // delay to ensure child onBlur has finished (ugly)
    window.setTimeout(() => {
      if (
        validDate(this.state.date)
        || validDatetime(this.state.time)
      ) {
        const combined = this.combinedStateValue()
        this.setState({
          ...splitDateTime(combined)
        }, () => {
          if (typeof this.props.onChange === 'function') {
            this.props.onChange(combined, true)
          }
        })
      }
      else {
        this.setState({
          date: null,
          time: null,
        }, () => {
          this.props.onChange(null, true)
        })
      }
    }, 0)
  }
  render() {
    let dateProps = {}
    if (!this.props.timeFirst) {
      dateProps.id = this.props.id
    }
    let date = (
      <DateInput
        ref={this.dateRef}
        value={this.state.date}
        onChange={this.handleDateChange}
        disabled={this.props.disabled}
        block={this.props.block}
        rightHang={this.props.timeFirst}
        showClearButton={false}
        textClassName={this.props.dateTextClassName}
        {...dateProps}
      />
    )
    let relativeStart = undefined
    const combined = this.combinedStateValue()
    if (this.props.relativeTo && !datetimeNull(combined)) {
      relativeStart = +startOfDay(new Date(combined))
    }
    let timeProps = {}
    if (this.props.timeFirst) {
      timeProps.id = this.props.id
    }
    let time = (
      <Time
        ref={this.timeRef}
        value={this.state.time}
        onChange={this.handleTimeChange}
        disabled={this.props.disabled}
        relativeTo={this.props.relativeTo}
        relativeStart={relativeStart}
        block={this.props.block}
        showClearButton={false}
        textClassName={this.props.timeTextClassName}
        {...timeProps}
      />
    )

    let first = date
    let second = time
    if (this.props.timeFirst) {
      first = time
      second = date
    }

    return (
      <BlockDiv
        ref={this.containerRef}
        block={this.props.block}
        className={classNames('MIRECO-datetime', this.props.className, {
          clearable: this.props.showClear,
        })}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        {first}
        {!this.props.block && <span>{' '}</span>}
        <BlockDiv block={this.props.block} className={classNames('second', {
          time: !this.props.timeFirst,
          date: this.props.timeFirst,
        })}>
          {second}
          {this.props.showClear && (
            <span>{' '}</span>
          )}
          {this.props.showClear && (
            <ClearButton
              onClick={this.handleClearClick}
              disabled={this.props.disabled}
              className={this.props.clearButtonClassName}
            />
          )}
        </BlockDiv>
      </BlockDiv>
    )
  }
}
