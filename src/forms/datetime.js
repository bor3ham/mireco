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
  constructor(props) {
    super(props)
    this.state = {
      ...this.splitValue(props.value),
    }
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
  handleDateChange = (newDate, wasBlur) => {
    this.setState(prevState => {
      let updates = {
        date: newDate,
      }
      if (typeof newDate === 'number' && typeof prevState.time !== 'number') {
        updates.time = 0
      }
      else if (newDate === null && wasBlur) {
        updates.time = null
      }
      return updates
    }, this.updateParentValue)
  }
  handleTimeChange = (newTime, wasBlur) => {
    this.setState(prevState => {
      let updates = {
        time: newTime,
      }
      if (typeof newTime === 'number' && typeof prevState.date !== 'number') {
        updates.date = +moment.utc().startOf('day')
      }
      else if (newTime === null && wasBlur) {
        updates.date = null
      }
      return updates
    }, this.updateParentValue)
  }
  updateParentValue = () => {
    let newValue = undefined
    if (this.state.date === null && this.state.time === null) {
      newValue = null
    }
    else if (typeof this.state.date === 'number' && typeof this.state.time === 'number') {
      newValue = this.state.date + this.state.time
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(newValue)
    }
  }
  render() {
    let split = this.splitValue(this.props.value)
    return (
      <span className={classNames("MIRECO-datetime", {
        block: this.props.block,
      })}>
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
      </span>
    )
  }
}

export default Datetime
