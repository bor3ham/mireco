import React, { useRef, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import BlockDiv from '../../components/block-div.js'
import Dropdown from '../../components/dropdown.js'
import ClearButton from '../../components/clear-button.js'
import ChevronDownVector from '../../components/chevron-down-vector.js'
import { propTypes as mirecoPropTypes, usePrevious } from 'utilities'
import WidgetText from './widget-text.js'

const ARROW_DOWN = 40
const ARROW_UP = 38
const ENTER = 13

function validChoice(value, props) {
  return (
    typeof props.value === 'string'
    || typeof props.value === 'number'
    || typeof props.value === 'boolean'
  )
}

function selectReducer(state, action) {
  switch (action.type) {
    case 'close': {
      return {
        ...state,
        dropdownOpen: false,
        text: action.formatted,
        filtering: false,
      }
    }
    case 'open': {
      return {
        ...state,
        dropdownOpen: true,
        filtering: false,
      }
    }
    case 'textFilter': {
      return {
        ...state,
        text: action.text,
        filtering: action.text.length > 0,
      }
    }
    case 'textOverride': {
      return {
        ...state,
        text: action.text,
        filtering: false,
      }
    }
  }
}

function Select(props) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const lastValidValue = useRef(props.value ? props.value : null)
  useEffect(() => {
    if (props.value) {
      lastValidValue.current = props.value
    }
  }, [props.value])

  let initialText = ''
  if (validChoice(props.value, props)) {
    const initialChoice = props.options.find(option => {
      return option.value === props.value
    })
    initialText = initialChoice ? initialChoice.label : `${props.value}`
  }

  const [state, dispatchState] = useReducer(selectReducer, {
    text: initialText,
    dropdownOpen: false,
    filtering: false,
  })

  const getFilteredOptions = (search) => {
    const terms = search.split(' ').map(term => {
      return term.trim().toLowerCase()
    }).filter(term => {
      return (term.length > 0)
    })
    return props.options.filter(option => {
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
  const onBlur = () => {
    if (validChoice(props.value, props)) {
      const selectedOption = props.options.find(option => {
        return option.value === props.value
      })
      const formatted = selectedOption ? selectedOption.label : `${props.value}`
      dispatchState({
        type: 'close',
        formatted,
      })
      if (typeof props.onChange === 'function') {
        props.onChange(props.value, true)
      }
    }
    else {
      dispatchState({
        type: 'close',
        formatted: '',
      })
      if (typeof props.onChange === 'function') {
        props.onChange(props.nullable ? null : lastValidValue.current, true)
      }
    }
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
    dispatchState({type: 'open'})
  }
  const handleTextKeyDown = (event) => {
    if (event.which === ENTER ) {
      if (state.dropdownOpen) {
        const current = props.options.find(option => {
          return option.value === props.value
        })
        dispatchState({
          type: 'close',
          formatted: current ? current.label : '',
        })
        event.preventDefault()
      }
      return
    }
    if (!state.dropdownOpen) {
      dispatchState({
        type: 'open',
      })
    }
    if (event) {
      if (event.which === ARROW_DOWN || event.which === ARROW_UP) {
        event.preventDefault()
        if (typeof props.onChange !== 'function') {
          return
        }
        let currentIndex = -1
        const filtered = state.filtering ? getFilteredOptions(state.text) : props.options
        if (!filtered.length) {
          return
        }
        filtered.map((option, index) => {
          if (option.value === props.value) {
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
          props.onChange(filtered[nextIndex].value)
        }
        else {
          props.onChange(props.nullable ? null : undefined)
        }
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
      props.onChange(props.nullable ? null : undefined, false)
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
        props.onChange(valueMatch, false)
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
          props.onChange(labelMatch, false)
        }
        else {
          const filtered = getFilteredOptions(newValue)
          const current = filtered.find(option => {
            return option.value === props.value
          })
          const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
          props.onChange(current ? current.value : firstFilteredValue, false)
        }
      }
    }
  }
  const handleDropdownSelect = (value) => {
    const selected = props.options.find(option => {
      return option.value === value
    })
    if (!selected) {
      console.warn('Could not find selected value in options', value)
      return
    }
    if (typeof props.onChange === 'function') {
      props.onChange(value, true)
    }
    textRef.current && textRef.current.focus()
    dispatchState({
      type: 'close',
      formatted: selected.label,
    })
  }

  const setTextFromPropValue = () => {
    const current = props.options.find(option => {
      return (option.value === props.value)
    })
    if (current) {
      dispatchState({
        type: 'textOverride',
        text: current.label,
      })
    }
    else {
      dispatchState({
        type: 'textOverride',
        text: `${props.value}`,
      })
    }
  }

  // on component received new props
  const prevProps = usePrevious(props)
  useEffect(() => {
    if (!prevProps) {
      return
    }
    if (prevProps.value !== props.value ) {
      if (props.value === null) {
        dispatchState({
          type: 'textOverride',
          text: '',
        })
      }
      else if (validChoice(props.value, props)) {
        if (!state.dropdownOpen) {
          setTextFromPropValue()
        }
        else {
          const filtered = getFilteredOptions(state.text)
          const current = filtered.find(option => {
            return (option.value === props.value)
          })
          if (!current) {
            setTextFromPropValue()
          }
        }
      }
    }
    if (props.disabled && !prevProps.disabled) {
      onBlur()
    }
  })
  const onClear = () => {
    if (props.disabled) {
      return
    }
    if (typeof props.onChange === 'function') {
      props.onChange(props.nullable ? null : undefined, false)
      dispatchState({
        type: 'textFilter',
        text: '',
      })
      textRef.current && textRef.current.focus()
    }
  }

  const filtered = state.filtering ? getFilteredOptions(state.text) : props.options
  const hasValue = !!props.value
  const clearable = hasValue
  return (
    <BlockDiv
      ref={containerRef}
      block={props.block}
      className={classNames('MIRECO-select', {
        'has-value': hasValue,
        clearable,
      }, props.className)}
      onBlur={handleContainerBlur}
    >
      <WidgetText
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
        onClear={clearable ? onClear : undefined}
      />
      {state.dropdownOpen && (
        <Dropdown
          options={filtered}
          value={props.value}
          onSelect={handleDropdownSelect}
          {...props.dropdownProps}
        />
      )}
    </BlockDiv>
  )
}
Select.propTypes = {
  value: mirecoPropTypes.selectValue,
  nullable: PropTypes.bool,
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
Select.defaultProps = {
  nullable: true,
  options: [],
  filter: true,
  icon: ChevronDownVector,
}

export default Select
