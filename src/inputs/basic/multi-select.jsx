import React, { useRef, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BlockDiv, Dropdown, ChevronDownVector, ClearButton } from '../../components'
import Text from './text.jsx'
import { propTypes as mirecoPropTypes, usePrevious } from '../../utilities'

const ARROW_DOWN = 40
const ARROW_UP = 38
const ENTER = 13
const ESCAPE = 27
const BACKSPACE = 8
const TAB = 9
const SHIFT = 16
const CAPS = 20

function multiSelectReducer(state, action) {
  switch (action.type) {
    case 'close': {
      return {
        ...state,
        dropdownOpen: false,
        text: '',
        selected: null,
      }
    }
    case 'open': {
      return {
        ...state,
        dropdownOpen: true,
      }
    }
    case 'textFilter': {
      return {
        ...state,
        text: action.text,
      }
    }
    case 'select': {
      return {
        ...state,
        selected: action.value,
      }
    }
    case 'focus': {
      return {
        ...state,
        inFocus: true,
        dropdownOpen: true,
      }
    }
    case 'blur': {
      return {
        ...state,
        inFocus: false,
        dropdownOpen: false,
        text: '',
        selected: null,
      }
    }
  }
}

function SelectedOption(props) {
  return (
    <li className="option">
      {props.label}
      <ClearButton onClick={props.remove} spaced={false} disabled={props.disabled} />
    </li>
  )
}
SelectedOption.propTypes = {
  label: PropTypes.string,
  remove: PropTypes.func,
  disabled: PropTypes.bool,
}

function MultiSelect(props) {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  const [state, dispatchState] = useReducer(multiSelectReducer, {
    text: '',
    dropdownOpen: false,
    selected: null,
  })
  const onBlur = () => {
    dispatchState({
      type: 'blur',
    })
  }

  // on component received new props
  const prevProps = usePrevious(props)
  useEffect(() => {
    if (!prevProps) {
      return
    }
    if (props.disabled && !prevProps.disabled) {
      onBlur()
    }
  })

  const addValue = (value) => {
    if (typeof props.onChange === 'function') {
      props.onChange([...new Set([
        ...props.value,
        value,
      ])], true)
    }
  }
  const removeAt = (index) => {
    if (props.disabled) {
      return
    }
    if (typeof props.onChange === 'function') {
      const updated = [...props.value]
      updated.splice(index, 1)
      props.onChange(updated, false)
      textRef.current && textRef.current.focus()
    }
  }
  const clearAll = () => {
    if (props.disabled) {
      return
    }
    if (typeof props.onChange === 'function') {
      props.onChange([], false)
      dispatchState({
        type: 'textFilter',
        text: '',
      })
      textRef.current && textRef.current.focus()
    }
  }
  const getFilteredOptions = (search) => {
    const terms = search.split(' ').map(term => {
      return term.trim().toLowerCase()
    }).filter(term => {
      return (term.length > 0)
    })
    return props.options.filter((option) => {
      if (props.value.indexOf(option.value) !== -1) {
        return false
      }
      if (terms.length === 0 || !props.filter) {
        return true
      }
      const searchable = `${option.label}${option.value}`.toLowerCase()
      let match = false
      terms.map(term => {
        if (searchable.indexOf(term) !== -1) {
          match = true
        }
      })
      return match
    })
  }
  const handleContainerBlur = (event) => {
    if (
      containerRef.current
      && (
        containerRef.current.contains(event.relatedTarget)
        || containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    onBlur()
  }
  const handleTextFocus = (event) => {
    dispatchState({type: 'focus'})
  }
  const handleTextKeyDown = (event) => {
    if (!event || event.which === SHIFT || event.which === CAPS) {
      return
    }
    if (event.which === ENTER || (event.which === TAB && state.selected !== null)) {
      if (state.dropdownOpen) {
        if (state.selected !== null) {
          addValue(state.selected)
        }
        dispatchState({
          type: 'close',
        })
        event.preventDefault()
      }
      return
    }
    if (!state.dropdownOpen && event.which !== ESCAPE) {
      dispatchState({
        type: 'open',
      })
    }
    if (event.which === BACKSPACE && state.text === '') {
      if (typeof props.onChange === 'function') {
        props.onChange(props.value.splice(0, props.value.length - 1), false)
      }
    }
    if (event.which === ARROW_DOWN || event.which === ARROW_UP) {
      event.preventDefault()
      if (typeof props.onChange !== 'function') {
        return
      }
      let currentIndex = -1
      const filtered = getFilteredOptions(state.text)
      if (!filtered.length) {
        return
      }
      filtered.map((option, index) => {
        if (option.value === state.selected) {
          currentIndex = index
        }
      })
      let nextIndex = currentIndex
      if (event.which === ARROW_DOWN) {
        nextIndex++
        if (nextIndex >= filtered.length) {
          nextIndex = 0
        }
      }
      if (event.which === ARROW_UP) {
        nextIndex--
        if (nextIndex < 0) {
          nextIndex = filtered.length - 1
        }
      }
      if (filtered[nextIndex]) {
        dispatchState({
          type: 'select',
          value: filtered[nextIndex].value,
        })
      }
      else {
        dispatchState({
          type: 'select',
          value: filtered[nextIndex].value,
        })
      }
    }
    if (event.which === ESCAPE) {
      if (state.dropdownOpen) {
        dispatchState({
          type: 'close',
        })
      }
    }
  }
  const handleTextChange = (newValue) => {
    dispatchState({
      type: 'textFilter',
      text: newValue,
    })
    if (typeof props.onTextChange === 'function') {
      props.onTextChange(newValue)
    }
    if (typeof props.onChange !== 'function') {
      return
    }
    let cleaned = newValue.trim().toLowerCase()
    if (cleaned.length <= 0) {
      dispatchState({
        type: 'select',
        value: null,
      })
    }
    else {
      let valueMatch = null
      props.options.map(option => {
        const optionValue = `${option.value}`.trim().toLowerCase()
        if (valueMatch === null && optionValue === cleaned) {
          valueMatch = option.value
        }
      })
      if (valueMatch !== null) {
        dispatchState({
          type: 'select',
          value: valueMatch,
        })
      }
      else {
        let labelMatch = null
        props.options.map(option => {
          const optionLabel = `${option.label}`.trim().toLowerCase()
          if (labelMatch === null && optionLabel === cleaned) {
            labelMatch = option.value
          }
        })
        if (labelMatch !== null) {
          dispatchState({
            type: 'select',
            value: labelMatch,
          })
        }
        else {
          const filtered = getFilteredOptions(newValue)
          const current = filtered.find(option => {
            return option.value === state.selected
          })
          const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
          dispatchState({
            type: 'select',
            value: current ? current.value : (firstFilteredValue || null),
          })
        }
      }
    }
  }
  const handleContainerClick = (event) => {
    if (props.disabled) {
      return
    }
    if (!state.dropdownOpen) {
      if (textRef.current && textRef.current.inputRef.current) {
        if (textRef.current.inputRef.current === document.activeElement) {
          dispatchState({
            type: 'open',
          })
        } else {
          textRef.current && textRef.current.focus()
        }
      }
    }
  }
  const handleDropdownSelect = (value) => {
    const selected = props.options.find(option => option.value === value)
    if (!selected) {
      console.warn('Could not find selected value in options', value)
      return
    }
    addValue(value)
    textRef.current && textRef.current.focus()
    dispatchState({
      type: 'close',
    })
  }

  const filtered = getFilteredOptions(state.text)
  const hasValue = props.value.length > 0
  const clearable = hasValue && !props.disabled
  return (
    <BlockDiv
      ref={containerRef}
      block={props.block}
      className={classNames('MIRECO-multi-select', {
        'has-value': hasValue,
        'in-focus': state.inFocus,
        disabled: props.disabled,
        clearable,
      }, props.className)}
      onBlur={handleContainerBlur}
      onClick={handleContainerClick}
      tabIndex={-1}
    >
      <ul className="selected">
        {props.value.map((selectedValue, valueIndex) => {
          const option = props.options.find((option) => option.value === selectedValue)
          const remove = () => {
            removeAt(valueIndex)
          }
          return (
            <SelectedOption
              key={`selected-${selectedValue}`}
              value={selectedValue}
              label={option ? option.label : selectedValue}
              remove={remove}
              disabled={props.disabled}
            />
          )
        })}
        <li className="text">
          <Text
            ref={textRef}
            placeholder={props.placeholder}
            value={state.text}
            onFocus={handleTextFocus}
            onKeyDown={handleTextKeyDown}
            onChange={handleTextChange}
            disabled={props.disabled}
            block={props.block}
            style={props.style}
            autoFocus={props.autoFocus}
            className={props.textClassName}
            id={props.id}
            icon={props.icon}
          />
        </li>
      </ul>
      {clearable && (
        <ClearButton onClick={clearAll} />
      )}
      {props.icon}
      {state.dropdownOpen && !props.disabled && (
        <Dropdown
          options={filtered}
          value={state.selected}
          onSelect={handleDropdownSelect}
          {...props.dropdownProps}
        />
      )}
    </BlockDiv>
  )
}
MultiSelect.propTypes = {
  value: PropTypes.arrayOf(mirecoPropTypes.selectValue).isRequired,
  options: PropTypes.arrayOf(mirecoPropTypes.selectOption).isRequired,
  placeholder: PropTypes.string,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
  style: PropTypes.object,
  dropdownProps: PropTypes.object,
  filter: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  id: PropTypes.string,
  icon: PropTypes.node,
}
MultiSelect.defaultProps = {
  options: [],
  filter: true,
  icon: ChevronDownVector,
}

export default MultiSelect
