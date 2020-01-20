import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class DropdownOption extends React.PureComponent {
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
    this.optionRef = React.createRef()
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
        ref={this.optionRef}
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

export default class Dropdown extends React.PureComponent {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired,
    })),
    value: PropTypes.any,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    block: PropTypes.bool,
  }
  constructor(props) {
    super(props)
    this.listRef = React.createRef()
    this.currentRef = React.createRef()
  }
  componentDidMount() {
    this.focusOnCurrent()
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      typeof this.props.value !== 'undefined'
      && this.props.value !== null
      && this.props.value !== prevProps.value
    ) {
      this.focusOnCurrent()
    }
  }
  handleSelect = (value) => {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(value)
    }
  }
  focusOnCurrent = () => {
    if (
      this.listRef.current
      && this.currentRef.current
      && this.currentRef.current.optionRef.current
    ) {
      // don't use scroll into view because this also scrolls parent containers (the body included)
      const currentOption = this.currentRef.current.optionRef.current
      const currentTop = currentOption.offsetTop
      const currentBottom = currentTop + currentOption.getBoundingClientRect().height
      const list = this.listRef.current
      const viewBottom = list.scrollTop + list.getBoundingClientRect().height
      if (list.scrollTop > currentTop) {
        list.scrollTop = currentTop
      }
      if (currentBottom > viewBottom) {
        list.scrollTop = currentBottom - list.getBoundingClientRect().height
      }
    }
  }
  render() {
    let options
    if (this.props.options && this.props.options.length) {
      options = this.props.options.map((option, index) => {
        let extraProps = {}
        const current = option.value === this.props.value
        if (current) {
          extraProps = {
            ref: this.currentRef,
          }
        }
        return (
          <DropdownOption
            {...extraProps}
            key={`option-${index}`}
            option={option}
            current={current}
            disabled={this.props.disabled}
            onSelect={this.handleSelect}
          />
        )
      })
    }
    else {
      options = (<li className="none">No options</li>)
    }
    return (
      <ul
        className={classNames('MIRECO-dropdown', {
          disabled: this.props.disabled,
        })}
        tabIndex={-1}
        ref={this.listRef}
      >
        {options}
      </ul>
    )
  }
}
