import React from 'react'
import PropTypes from 'prop-types'
import { startOfHour, addHours } from 'date-fns'

import { Datetime, Duration } from 'inputs'
import { ClearButton, BlockDiv } from 'components'

export default class DatetimeRange extends React.Component {
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
    showClear: PropTypes.bool,
    className: PropTypes.string,
  }
  static defaultProps = {
    block: false,
    disabled: false,
    defaultDuration: 60 * 60 * 1000,
    getDefaultStart: function() {
      return +addHours(startOfHour(new Date()), 1)
    },
    showClear: true,
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      duration: this.durationFromValue(props.value),
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
        if (typeof this.props.value === 'object' && typeof this.props.value.end === 'number') {
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
      if (typeof this.props.onChange === 'function') {
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
      }
    })
  }
  handleClearClick = () => {
    if (typeof this.props.onChange == 'function') {
      this.props.onChange({
        start: null,
        end: null,
      })
    }
  }
  render() {
    let split = this.splitValue(this.props.value)
    return (
      <BlockDiv
        block={this.props.block}
        className={'MIRECO-datetime-range'}
      >
        <Datetime
          value={split.start}
          onChange={this.handleStartChange}
          disabled={this.props.disabled}
          block={this.props.block}
          className="start"
          showClear={false}
        />
        <BlockDiv className="datetime-range-second" block={this.props.block}>
          <span className="to">{' to '}</span>
          <Datetime
            value={split.end}
            onChange={this.handleEndChange}
            disabled={this.props.disabled}
            timeFirst={true}
            block={this.props.block}
            className="end"
            showClear={false}
            relativeTo={split.start}
          />
        </BlockDiv>
        {!this.props.block && (
          <span>{' '}</span>
        )}
        <BlockDiv className="duration-container" block={this.props.block}>
          <BlockDiv className="duration-inner" block={this.props.block} inlineDisplay="flex">
            <Duration
              value={this.state.duration}
              onChange={this.handleDurationChange}
              disabled={this.props.disabled}
              block={this.props.block}
            />
            {this.props.showClear && (
              <ClearButton
                onClick={this.handleClearClick}
                disabled={this.props.disabled}
              />
            )}
          </BlockDiv>
        </BlockDiv>
      </BlockDiv>
    )
  }
}