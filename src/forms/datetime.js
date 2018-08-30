import React from 'react'
import moment from 'moment'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Date from './date.js'
import Time from './time.js'

class Datetime extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
  }
  static defaultProps = {
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
        this.setState(this.splitValue(this.props.value))
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
  combinedStateValue = () => {
    let value = +moment.utc().startOf('day')
    if (typeof this.state.date === 'number') {
      value = this.state.date
    }
    if (typeof this.state.time === 'number') {
      value += this.state.time
    }
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
      else if (typeof this.state.date === 'number' && typeof this.state.time === 'number') {
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
  onBlur = () => {
    if (typeof this.state.date === 'number' || typeof this.state.time === 'number') {
      let value = this.combinedStateValue()
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(value, true)
      }
    }
    else {
      this.props.onChange(null, true)
    }
  }
  render() {
    let split = this.splitValue(this.props.value)
    return (
      <div
        ref={this.containerRef}
        className={classNames('MIRECO-datetime', {
          block: this.props.block,
        })}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
        style={{
          display: 'inline-block',
        }}
      >
        <Date
          value={this.state.date}
          onChange={this.handleDateChange}
          disabled={this.props.disabled}
        />
        {' '}
        <Time
          value={this.state.time}
          onChange={this.handleTimeChange}
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

export default Datetime
