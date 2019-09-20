import React from 'react'
import PropTypes from 'prop-types'
import { startOfDay, format, parse } from 'date-fns'

import { Date as MirecoDate, Time } from 'inputs'
import { ClearButton, BlockDiv } from 'components'
import { ISO_8601_DATE_FORMAT } from 'utilities'

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
  if (typeof value === 'number' && !isNaN(value)) {
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

export default class Datetime extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    timeFirst: PropTypes.bool,
    showClear: PropTypes.bool,
    className: PropTypes.string,
    relativeTo: PropTypes.number,
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
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({
          date: null,
          time: null,
        })
      }
      else if (typeof this.props.value === 'number' && !isNaN(this.props.value)) {
        if (this.props.value !== this.combinedStateValue()) {
          this.setState({
            ...splitDateTime(this.props.value),
          })
        }
      }
    }
  }
  combinedStateValue() {
    return combineDateTime(
      this.state.date || format(new Date(), ISO_8601_DATE_FORMAT),
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
      if (this.state.date === null && this.state.time === null) {
        this.props.onChange(null, false)
      }
      else if (
        typeof this.state.date === 'string'
        || (typeof this.state.time === 'number' && !isNaN(this.state.time))
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
        && this.dateRef.current.containerRef.current.divRef.current
        && (
          this.dateRef.current.containerRef.current.divRef.current.contains(
            event.relatedTarget
          )
          || this.dateRef.current.containerRef.current.divRef.current == event.relatedTarget
        )
      )
      const containedInTime = (
        this.timeRef.current
        && this.timeRef.current.containerRef.current
        && this.timeRef.current.containerRef.current.divRef.current
        && (
          this.timeRef.current.containerRef.current.divRef.current.contains(
            event.relatedTarget
          )
          || this.timeRef.current.containerRef.current.divRef.current == event.relatedTarget
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
        typeof this.state.date === 'string'
        || (typeof this.state.time === 'number' && !isNaN(this.state.time))
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
    let date = (
      <MirecoDate
        ref={this.dateRef}
        value={this.state.date}
        onChange={this.handleDateChange}
        disabled={this.props.disabled}
        block={this.props.block}
      />
    )
    let time = (
      <Time
        ref={this.timeRef}
        value={this.state.time}
        onChange={this.handleTimeChange}
        disabled={this.props.disabled}
        relativeTo={this.props.relativeTo}
        relativeStart={dateAsMs(this.state.date)}
        block={this.props.block}
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
        className="MIRECO-datetime"
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        {first}
        {!this.props.block && <span>{' '}</span>}
        <BlockDiv block={this.props.block} className="second">
          {second}
          {this.props.showClear && (
            <span>{' '}</span>
          )}
          {this.props.showClear && (
            <ClearButton
              onClick={this.handleClearClick}
              disabled={this.props.disabled}
            />
          )}
        </BlockDiv>
      </BlockDiv>
    )
  }
}
