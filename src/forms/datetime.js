import React from 'react'
import moment from 'moment'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Date from './date.js'
import Time from './time.js'
import { ClearButton } from './components'

class Datetime extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
    timeFirst: PropTypes.bool,
    showClear: PropTypes.bool,
    className: PropTypes.string,
    relativeTo: PropTypes.number,
    timeProps: PropTypes.object,
    dateProp: PropTypes.object,
  }
  static defaultProps = {
    block: false,
    timeFirst: false,
    showClear: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.splitValue(props.value),
    }
    this.containerRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({
          date: null,
          time: null,
        })
      }
      else if (typeof this.props.value === 'number') {
        let split = this.splitValue(this.props.value)
        this.setState(prevState => {
          let updates = {}
          // check if the date value is different
          if (split.date !== prevState.date) {
            updates.date = split.date
          }
          // check if the time value is different
          if (split.time !== prevState.time) {
            updates.time = split.time
          }
          return updates
        })
      }
    }
  }
  splitValue = (value) => {
    let dateValue = (value === null ? null : undefined)
    let timeValue = (value === null ? null : undefined)
    if (typeof this.props.value === 'number') {
      dateValue = +moment.utc(this.props.value).startOf('day')
      timeValue = this.props.value - dateValue
    }
    return {
      date: dateValue,
      time: timeValue,
    }
  }
  fallbackDate = (dateValue) => {
    let value = +moment.utc().startOf('day')
    if (typeof dateValue === 'number') {
      value = dateValue
    }
    return value
  }
  fallbackTime = (timeValue) => {
    let value = 0
    if (typeof timeValue === 'number') {
      value = timeValue
    }
    return value
  }
  combinedStateValue = () => {
    let value = this.fallbackDate(this.state.date)
    value += this.fallbackTime(this.state.time)
    return value
  }
  handleDateChange = (newDate, wasBlur) => {
    this.setState({date: newDate}, this.updateParentValue)
  }
  handleTimeChange = (newTime, wasBlur) => {
    this.setState({time: newTime}, this.updateParentValue)
  }
  updateParentValue = () => {
    if (typeof this.props.onChange === 'function') {
      let value = undefined
      if (this.state.date === null && this.state.time === null) {
        value = null
      }
      else if (typeof this.state.date === 'number' || typeof this.state.time === 'number') {
        value = this.combinedStateValue()
      }
      this.props.onChange(value, false)
    }
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
  handleClearClick = (event) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(null, true)
    }
  }
  onBlur = () => {
    // delay to ensure that child onBlur's complete first
    window.setTimeout(() => {
      this.setState(this.splitValue(this.props.value), () => {
        if (typeof this.state.date === 'number' || typeof this.state.time === 'number') {
          let value = this.combinedStateValue()
          if (typeof this.props.onChange === 'function') {
            this.props.onChange(value, true)
          }
        }
        else {
          this.props.onChange(null, true)
        }
      })
    }, 0)
  }
  render() {
    let split = this.splitValue(this.props.value)
    let date = (
      <Date
        {...this.props.dateProps}
        value={this.state.date}
        onChange={this.handleDateChange}
        disabled={this.props.disabled}
        rightHang={this.props.timeFirst}
      />
    )
    let time = (
      <Time
        {...this.props.timeProps}
        value={this.state.time}
        onChange={this.handleTimeChange}
        disabled={this.props.disabled}
        relativeTo={this.props.relativeTo}
        relativeStart={this.state.date}
      />
    )

    let first = date
    let second = time
    if (this.props.timeFirst) {
      first = time
      second = date
    }

    return (
      <div
        ref={this.containerRef}
        className={classNames(
          'MIRECO-datetime',
          {
            block: this.props.block,
          },
          this.props.className,
        )}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
        style={{
          display: 'inline-block',
        }}
      >
        {first}
        {!this.props.block && (<span>&nbsp;</span>)}
        {second}
        {!this.props.block && this.props.showClear && (
          <span>&nbsp;</span>
        )}
        {this.props.showClear && (
          <ClearButton
            onClick={this.handleClearClick}
            disabled={this.props.disabled}
          />
        )}
      </div>
    )
  }
}

export default Datetime
