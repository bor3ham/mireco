import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class DropdownOption extends React.Component {
  static propTypes = {
    current: PropTypes.bool,
    disabled: PropTypes.bool,
    option: PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired,
    }),
    onSelect: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.itemRef = React.createRef()
  }
  handleClick = () => {
    this.props.onSelect(this.props.option.value)
  }
  render() {
    return (
      <li
        className={classNames({
          current: this.props.current,
        })}
        ref={this.itemRef}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={this.props.disabled}
          onClick={this.handleClick}
        >
          {this.props.option.label}
        </button>
      </li>
    )
  }
}

export default class Dropdown extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired,
    })),
    value: PropTypes.any,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    continuousOptions: PropTypes.bool,
    block: PropTypes.bool,
  }
  static defaultProps = {
    continuousOptions: false,
  }
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.currentRef = React.createRef()
  }
  componentDidMount() {
    if (this.props.value) {
      this.focusOnCurrent()
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.value
      && this.props.value !== prevProps.value
    ) {
      this.focusOnCurrent()
    }
  }
  focusOnCurrent = () => {
    if (
      this.containerRef.current
      && this.currentRef.current
      && this.currentRef.current.itemRef.current
    ) {
      this.containerRef.current.scrollTop = this.currentRef.current.itemRef.current.offsetTop
    }
  }
  getCurrentIndex = () => {
    let currentIndex = -1
    this.props.options.map((option, index) => {
      if (
        option.value === this.props.value
        || (this.props.continuousOptions && this.props.value >= option.value)
      ) {
        currentIndex = index
      }
    })
    return currentIndex
  }
  selectPrevious = () => {
    let prevIndex
    if (this.props.value !== 'undefined' && this.props.value !== null) {
      let currentIndex = this.getCurrentIndex()
      prevIndex = currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = this.props.options.length - 1
      }
    }
    else {
      prevIndex = this.props.options.length - 1
    }
    if (this.props.options.length > prevIndex) {
      this.handleSelect(this.props.options[prevIndex].value)
    }
  }
  selectNext = () => {
    let nextIndex
    if (this.props.value !== 'undefined' && this.props.value !== null) {
      let currentIndex = this.getCurrentIndex()
      nextIndex = currentIndex + 1
      if (nextIndex >= this.props.options.length) {
        nextIndex = 0
      }
    }
    else {
      nextIndex = 0
    }
    if (this.props.options.length > nextIndex) {
      this.handleSelect(this.props.options[nextIndex].value)
    }
  }
  handleSelect = (value) => {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(value)
    }
  }
  render() {
    const options = this.props.options || []
    return (
      <ul
        className={classNames('MIRECO-dropdown', {
          disabled: this.props.disabled,
        })}
        tabIndex={-1}
        ref={this.containerRef}
      >
        {this.props.options.map((option, index) => {
          const extraProps = {}
          const current = (option.value === this.props.value)
          if (current) {
            extraProps.ref = this.currentRef
          }
          return (
            <DropdownOption
              key={`option-${index}`}
              option={option}
              current={current}
              disabled={this.props.disabled}
              onSelect={this.handleSelect}
              setScrollTop={this.setScrollTop}
              {...extraProps}
            />
          )
        })}
        {!options.length && (
          <li>No options</li>
        )}
      </ul>
    )
  }
}
