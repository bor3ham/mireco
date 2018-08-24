import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

import Text from './text.js'

class Calendar extends React.Component {
  render() {
    return (
      <div className="MIRECO-calendar">

      </div>
    )
  }
}

class Date extends React.Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.number,
    disabled: PropTypes.bool,
    block: PropTypes.bool,
  }
  static defaultProps = {
    format: 'DD/MM/YYYY',
    placeholder: 'dd/mm/yyyy',
  }
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      textValue: this.format(props, props.value),
      inFocus: false,
    }
    this.containerRef = React.createRef()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (typeof this.props.value === 'number') {
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
    let parsed = moment.utc(value)
    return parsed.format(props.format)
  }
  parseText = (textValue) => {
    let trimmed = textValue.trim()
    if (trimmed.length === 0) {
      return null
    }
    let parsed = moment.utc(trimmed, this.props.format)
    if (parsed.isValid()) {
      return +parsed
    }
    return undefined
  }
  handleFocus = (event) => {
    this.setState({inFocus: true})
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
    this.setState({inFocus: true})
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        let current = this.props.value || +moment.utc().startOf('day')
        this.props.onChange(current + +moment.duration({days: 1}))
      }
      if (event.which === 38) {
        event.preventDefault()
        let current = this.props.value || +moment.utc().startOf('day')
        this.props.onChange(current - +moment.duration({days: 1}))
      }
    }
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      this.props.onChange(this.parseText(newValue))
    })
  }
  onBlur = () => {
    if (typeof this.props.value === 'number') {
      let formatted = this.format(this.props, this.props.value)
      this.setState({
        textValue: formatted,
        inFocus: false,
      })
    }
    else {
      this.setState({
        textValue: '',
        inFocus: false,
      }, () => {
        this.props.onChange(null)
      })
    }
  }
  render() {
    return (
      <div
        ref={this.containerRef}
        className={classNames("MIRECO-date", {
          block: this.props.block,
        })}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        <Text
          placeholder={this.props.placeholder}
          value={this.state.textValue}
          onChange={this.handleTextChange}
          onFocus={this.handleFocus}
          disabled={this.props.disabled}
          onKeyDown={this.handleTextKeyDown}
        />
        {this.state.inFocus && !this.props.disabled && (
          <Calendar />
        )}
      </div>
    )
  }
}

export default Date
