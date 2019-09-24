import React from 'react'
import PropTypes from 'prop-types'
import { startOfHour, addHours } from 'date-fns'

import { Datetime, Duration } from 'inputs'
import { ClearButton, BlockDiv } from 'components'

function datetimeNull(datetime) {
  return datetime === null
}
function validDatetime(datetime) {
  return (typeof datetime === 'number' && !isNaN(datetime))
}
function validRange(range) {
  return (range && validDatetime(range.start) && validDatetime(range.end))
}
function splitRange(range) {
  if (range) {
    return {
      start: range.start,
      end: range.end,
    }
  }
  return {
    start: undefined,
    end: undefined,
  }
}
function combineRange(start, end) {
  return {
    start,
    end,
  }
}
function rangeNull(range) {
  return range === null || (range && range.start === null && range.end === null)
}
function rangesEqual(range1, range2) {
  if (typeof range1 === 'undefined' && typeof range2 === 'undefined') {
    return true
  }
  if (range1 === null && range2 === null) {
    return true
  }
  if (
    range1
    && range2
    && range1.start === range2.start
    && range1.end === range2.end
  ) {
    return true
  }
  return false
}

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
    showClear: PropTypes.bool,
    className: PropTypes.string,
  }
  static defaultProps = {
    block: false,
    disabled: false,
    defaultDuration: 60 * 60 * 1000,
    showClear: true,
  }
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.startRef = React.createRef()
    this.endRef = React.createRef()
    this.state = {
      ...this.state,
      ...splitRange(props.value),
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (!rangesEqual(prevProps.value, this.props.value)) {
      if (rangeNull(this.props.value)) {
        this.setState({
          start: null,
          end: null,
        })
      }
      else if (validRange(this.props.value)) {
        if (!rangesEqual(this.props.value, this.combinedStateValue())) {
          this.setState({
            ...splitRange(this.props.value),
          })
        }
      }
    }
  }
  combinedStateValue() {
    let start = this.state.start
    let end = this.state.end
    if (validDatetime(start) && !validDatetime(end)) {
      end = start + this.props.defaultDuration
    }
    if (validDatetime(end) && !validDatetime(start)) {
      start = end - this.props.defaultDuration
    }
    return combineRange(
      start,
      end
    )
  }
  handleStartChange = (newStart, wasBlur) => {
    this.setState({start: newStart}, this.updateParentValue)
  }
  handleEndChange = (newEnd, wasBlur) => {
    this.setState({end: newEnd}, this.updateParentValue)
  }
  updateParentValue = () => {
    if (typeof this.props.onChange === 'function') {
      if (datetimeNull(this.state.start) && datetimeNull(this.state.end)) {
        this.props.onChange(null, false)
      }
      else if (
        validDatetime(this.state.start)
        || validDatetime(this.state.end)
      ) {
        this.props.onChange(this.combinedStateValue(), false)
      }
      else {
        this.props.onChange(undefined, false)
      }
    }
  }
  handleClearClick = () => {
    if (typeof this.props.onChange == 'function') {
      this.props.onChange(null)
    }
  }
  handleContainerBlur = (event) => {
    if (event.relatedTarget) {
      const startDateDiv = (
        this.startRef.current
        && this.startRef.current.dateRef.current
        && this.startRef.current.dateRef.current.containerRef.current
        && this.startRef.current.dateRef.current.containerRef.current.divRef.current
      )
      const startTimeDiv = (
        this.startRef.current
        && this.startRef.current.timeRef.current
        && this.startRef.current.timeRef.current.containerRef.current
        && this.startRef.current.timeRef.current.containerRef.current.divRef.current
      )
      const containedInStart = (
        (startDateDiv && (
          startDateDiv.contains(event.relatedTarget)
          || event.relatedTarget === startDateDiv
        ))
        || (startTimeDiv && (
          startTimeDiv.contains(event.relatedTarget)
          || event.relatedTarget === startTimeDiv
        ))
      )
      const endDateDiv = (
        this.endRef.current
        && this.endRef.current.dateRef.current
        && this.endRef.current.dateRef.current.containerRef.current
        && this.endRef.current.dateRef.current.containerRef.current.divRef.current
      )
      const endTimeDiv = (
        this.endRef.current
        && this.endRef.current.timeRef.current
        && this.endRef.current.timeRef.current.containerRef.current
        && this.endRef.current.timeRef.current.containerRef.current.divRef.current
      )
      const containedInEnd = (
        (endDateDiv && (
          endDateDiv.contains(event.relatedTarget)
          || event.relatedTarget === endDateDiv
        ))
        || (endTimeDiv && (
          endTimeDiv.contains(event.relatedTarget)
          || event.relatedTarget === endTimeDiv
        ))
      )
      if (containedInStart || containedInEnd) {
        // ignore internal blur
        return
      }
    }
    this.onBlur()
  }
  onBlur = () => {
    // delay to ensure ALL child onBlur has finished (ugly)
    window.setTimeout(() => {
      if (
        validDatetime(this.state.start)
        || validDatetime(this.state.end)
      ) {
        const combined = this.combinedStateValue()
        this.setState({
          ...splitRange(combined)
        }, () => {
          if (typeof this.props.onChange === 'function') {
            this.props.onChange(combined, true)
          }
        })
      }
      else {
        this.setState({
          start: null,
          end: null,
        }, () => {
          this.props.onChange(null, true)
        })
      }
    }, 1)
  }
  render() {
    return (
      <BlockDiv
        block={this.props.block}
        ref={this.containerRef}
        className={'MIRECO-datetime-range'}
        onBlur={this.handleContainerBlur}
      >
        <Datetime
          ref={this.startRef}
          value={this.state.start}
          onChange={this.handleStartChange}
          disabled={this.props.disabled}
          block={this.props.block}
          className="start"
          showClear={false}
        />
        <BlockDiv className="datetime-range-second" block={this.props.block}>
          <span className="to">{' - '}</span>
          <Datetime
            ref={this.endRef}
            value={this.state.end}
            onChange={this.handleEndChange}
            disabled={this.props.disabled}
            timeFirst={true}
            block={this.props.block}
            className="end"
            showClear={false}
            relativeTo={this.state.start}
          />
        </BlockDiv>
        {!this.props.block && (
          <span>{' '}</span>
        )}
        <BlockDiv className="duration-container" block={this.props.block}>
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
