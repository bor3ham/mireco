import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import Datetime from './datetime.js'

class DatetimeRange extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    block: false,
  }
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     ...this.state,
  //     ...this.splitValue(props.value),
  //   }
  // }
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
  handleStartChange = (newStart, wasBlur) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        ...this.props.value,
        start: newStart,
      })
    }
  }
  handleEndChange = (newEnd, wasBlur) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        ...this.props.value,
        end: newEnd,
      })
    }
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
        />
        {' to '}
        <Datetime
          value={split.end}
          onChange={this.handleEndChange}
        />
        {' '}
      </div>
    )
  }
}

export default DatetimeRange
