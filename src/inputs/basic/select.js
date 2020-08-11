import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Text from './text.js'
import BlockDiv from '../../components/block-div.js'
import Dropdown from '../../components/dropdown.js'
import { propTypes as mirecoPropTypes } from 'utilities'

const ARROW_DOWN = 40
const ARROW_UP = 38
const ENTER = 13

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

function validChoice(value, props) {
  return (
    typeof props.value === 'string'
    || typeof props.value === 'number'
    || typeof props.value === 'boolean'
  )
}

function Select(props) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const dropdownRef = useRef(null)

  let initialText = ''
  if (validChoice(props.value, props)) {
    const initialChoice = props.options.find(option => {
      return option.value === props.value
    })
    initialText = initialChoice ? initialChoice.label : `${props.value}`
  }

  const [text, setText] = useState(initialText)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getFilteredOptions = () => {
    const terms = text.split(' ').map(term => {
      return term.trim().toLowerCase()
    }).filter(term => {
      return (term.length > 0)
    })
    return props.options.filter(option => {
      if (terms.length === 0) {
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
      setText(formatted)
      setDropdownOpen(false)
      if (typeof props.onChange === 'function') {
        props.onChange(props.value, true)
      }
    }
    else {
      setText('')
      setDropdownOpen(false)
      if (typeof props.onChange === 'function') {
        props.onChange(null, true)
      }
    }
  }
  const handleContainerBlur = (event) => {
    if (
      containerRef.current
      && containerRef.current.divRef.current
      && (
        containerRef.current.divRef.current.contains(event.relatedTarget)
        || containerRef.current.divRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    onBlur()
  }
  const handleTextFocus = (event) => {
    setDropdownOpen(true)
  }
  const handleTextKeyDown = (event) => {
    if (event.which === ENTER ) {
      if (dropdownOpen) {
        const current = props.options.find(option => {
          return option.value === props.value
        })
        setDropdownOpen(false)
        setText(current ? current.label : '')
        event.preventDefault()
      }
      return
    }
    if (!dropdownOpen) {
      setDropdownOpen(true)
    }
    if (event) {
      if (event.which === ARROW_DOWN || event.which === ARROW_UP) {
        event.preventDefault()
        if (typeof props.onChange !== 'function') {
          return
        }
        let currentIndex = -1
        const filtered = getFilteredOptions()
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
          props.onChange(null)
        }
      }
    }
  }
  const handleTextChange = (newValue) => {
    setText(newValue)
    if (typeof props.onTextChange === 'function') {
      props.onTextChange(newValue)
    }
    if (typeof props.onChange !== 'function') {
      return
    }
    let cleaned = newValue.trim().toLowerCase()
    if (cleaned.length <= 0) {
      props.onChange(null, false)
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
          const filtered = getFilteredOptions()
          const current = filtered.find(option => {
            return option.value === props.value
          })
          props.onChange(current ? current.value : undefined, false)
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
    setDropdownOpen(false)
    setText(selected.label)
  }

  const setTextFromPropValue = () => {
    const current = props.options.find(option => {
      return (option.value === props.value)
    })
    if (current) {
      setText(current.label)
    }
    else {
      setText(`${props.value}`)
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
        setText('')
      }
      else if (validChoice(props.value, props)) {
        if (!dropdownOpen) {
          setTextFromPropValue()
        }
        else {
          const filtered = getFilteredOptions()
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

  const filtered = getFilteredOptions()
  return (
    <BlockDiv
      ref={containerRef}
      block={props.block}
      className={classNames('MIRECO-select', {
        'has-value': !!props.value,
      })}
      tabIndex={-1}
      onBlur={handleContainerBlur}
    >
      <Text
        ref={textRef}
        placeholder={props.placeholder}
        value={text}
        onFocus={handleTextFocus}
        onKeyDown={handleTextKeyDown}
        onChange={handleTextChange}
        disabled={props.disabled}
        block={props.block}
        style={props.style}
      />
      {dropdownOpen && (
        <Dropdown
          ref={dropdownRef}
          options={filtered}
          value={props.value}
          onSelect={handleDropdownSelect}
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
}
Select.defaultProps = {
  nullable: true,
  options: [],
}

export default Select
