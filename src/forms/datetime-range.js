import React from 'react'
import moment from 'moment'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Datetime from './datetime.js'
import Duration from './duration.js'

class DatetimeRange extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.shape({
      start: PropTypes.number,
      end: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    defaultDuration: PropTypes.number.isRequired,
    getDefaultStart: PropTypes.func.isRequired,
  }
  static defaultProps = {
    block: false,
    disabled: false,
    defaultDuration: 60 * 60 * 1000,
    getDefaultStart: function() {
      return +moment.utc().startOf('hour').add({hours: 1})
    },
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      duration: this.durationFromValue(this.props.value),
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (!this.valuesEqual(prevProps.value, this.props.value)) {
      let split = this.splitValue(this.props.value)
      if (typeof split.start === 'number' && typeof split.end === 'number') {
        this.setState({
          duration: this.durationFromValue(this.props.value),
        })
      }
      else if (split.end === null) {
        this.setState({
          duration: null,
        })
      }
    }
  }
  splitValue = (value) => {
    let split = {
      start: undefined,
      end: undefined,
    }
    if (value === null) {
      split.start = null
      split.end = null
    }
    else if (typeof value === 'object') {
      split.start = value.start
      split.end = value.end
    }
    return split
  }
  valuesEqual = (valueOne, valueTwo) => {
    let splitOne = this.splitValue(valueOne)
    let splitTwo = this.splitValue(valueTwo)
    if (splitOne.start === splitTwo.start && splitOne.end === splitTwo.end) {
      return true
    }
    return false
  }
  durationFromValue = (value) => {
    let split = this.splitValue(value)
    if (typeof split.start === 'number' && typeof split.end === 'number') {
      return split.end - split.start
    }
    return null
  }
  handleStartChange = (newStart, wasBlur) => {
    if (typeof this.props.onChange === 'function') {
      let newValue = {
        ...this.props.value,
      }
      newValue.start = newStart
      if (typeof newValue.start === 'number') {
        if (typeof this.props.value.end === 'number') {
          let prevDuration = this.durationFromValue(this.props.value)
          if (prevDuration !== null) {
            newValue.end = newValue.start + prevDuration
          }
        }
        else {
          newValue.end = newValue.start + this.props.defaultDuration
        }
      }
      this.props.onChange(newValue)
    }
  }
  handleEndChange = (newEnd, wasBlur) => {
    if (typeof this.props.onChange === 'function') {
      let newValue = {
        ...this.props.value,
      }
      newValue.end = newEnd
      if (
        wasBlur
        && typeof newValue.end === 'number'
        && typeof newValue.start === 'number'
        && newValue.start > newValue.end
      ) {
        let prevStart = newValue.start
        newValue.start = newValue.end
        newValue.end = prevStart
      }
      this.props.onChange(newValue)
    }
  }
  handleDurationChange = (newDuration, wasBlur) => {
    this.setState({
      duration: newDuration,
    }, () => {
      if (typeof this.state.duration === 'number') {
        let split = this.splitValue(this.props.value)
        if (typeof split.start === 'number') {
          this.props.onChange({
            start: split.start,
            end: split.start + this.state.duration,
          })
        }
        else if (typeof split.end === 'number') {
          this.props.onChange({
            start: split.end - this.state.duration,
            end: split.end,
          })
        }
        else {
          let defaultStart = this.props.getDefaultStart()
          this.props.onChange({
            start: defaultStart,
            end: defaultStart + this.state.duration,
          })
        }
      }
      else if (this.state.duration === null) {
        this.props.onChange({
          ...this.props.value,
          end: null,
        })
      }
    })
  }
  render() {
    let split = this.splitValue(this.props.value)
    return (
      <div
        className={classNames('MIRECO_datetime-range', {
          block: this.props.block,
        })}
        style={{
          display: 'inline-block',
        }}
      >
        <Datetime
          value={split.start}
          onChange={this.handleStartChange}
          disabled={this.props.disabled}
        />
        {' to '}
        <Datetime
          value={split.end}
          onChange={this.handleEndChange}
          disabled={this.props.disabled}
          timeFirst={true}
        />
        {' '}
        <Duration
          value={this.state.duration}
          onChange={this.handleDurationChange}
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

export default DatetimeRange
