import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { usePrevious } from '../hooks'

let DropdownOption = (props, ref) => {
  const handleClick = () => {
    props.onSelect(props.option.value)
  }
  return (
    <li
      className={classNames({
        current: props.current,
      })}
      ref={ref}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled={props.disabled}
        onClick={handleClick}
      >
        {props.option.label}
      </button>
    </li>
  )
}
DropdownOption = React.forwardRef(DropdownOption)
DropdownOption.propTypes = {
  current: PropTypes.bool,
  disabled: PropTypes.bool,
  option: PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
}

function Dropdown(props) {
  const listRef = useRef(null)
  const currentRef = useRef(null)

  const focusOnCurrent = () => {
    if (
      listRef.current
      && currentRef.current
    ) {
      // don't use scroll into view because this also scrolls parent containers (the body included)
      const currentOption = currentRef.current
      const currentTop = currentOption.offsetTop
      const currentBottom = currentTop + currentOption.getBoundingClientRect().height
      const list = listRef.current
      const viewBottom = list.scrollTop + list.getBoundingClientRect().height
      if (list.scrollTop > currentTop) {
        list.scrollTop = currentTop
      }
      if (currentBottom > viewBottom) {
        list.scrollTop = currentBottom - list.getBoundingClientRect().height
      }
    }
  }

  useEffect(() => {
    focusOnCurrent()
  }, [])

  const prevProps = usePrevious(props)
  useEffect(() => {
    if (!prevProps) {
      return
    }
    if (
      typeof props.value !== 'undefined'
      && props.value !== null
      && props.value !== prevProps.value
    ) {
      focusOnCurrent()
    }
  })
  const handleSelect = (value) => {
    if (typeof props.onSelect === 'function') {
      props.onSelect(value)
    }
  }

  let options
  if (props.options && props.options.length) {
    options = props.options.map((option, index) => {
      let extraProps = {}
      const current = option.value === props.value
      if (current) {
        extraProps = {
          ref: currentRef,
        }
      }
      return (
        <DropdownOption
          {...extraProps}
          key={`option-${index}`}
          option={option}
          current={current}
          disabled={props.disabled}
          onSelect={handleSelect}
        />
      )
    })
  }
  else {
    options = (<li className="none">{props.noOptionsPrompt}</li>)
  }
  return (
    <ul
      className={classNames('MIRECO-dropdown', {
        disabled: props.disabled,
      })}
      tabIndex={-1}
      ref={listRef}
    >
      {props.beforeOptions}
      {options}
      {props.afterOptions}
    </ul>
  )
}
Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string.isRequired,
  })),
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  block: PropTypes.bool,
  noOptionsPrompt: PropTypes.string,
  beforeOptions: PropTypes.node,
  afterOptions: PropTypes.node,
}
Dropdown.defaultProps = {
  noOptionsPrompt: 'No options',
}

export default Dropdown
