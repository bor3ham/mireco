import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import Select from '../basic/select.js'
import { propTypes as mirecoPropTypes } from 'utilities'

function AsyncSelect(props) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState('')
  const stateRef = useRef()
  const debounce = useRef()

  stateRef.current = searchedTerm

  useEffect(() => {
    if (props.value === null && (options.length > 0 || loading)) {
      setOptions([])
      setLoading(false)
    }
  })

  let basicOptions = []
  if (!loading) {
    basicOptions = [...options]
  }
  let basicValue = props.value
  if (props.value !== null && typeof props.value !== 'undefined') {
    basicValue = props.value.value
    const valueOption = basicOptions.find(option => {
      return option.value === basicValue
    })
    if (!valueOption) {
      basicOptions = [...basicOptions, props.value]
    }
  }
  const handleTextChange = (newText) => {
    const cleaned = newText.trim()
    setSearchedTerm(cleaned)
    if (cleaned.length > 0) {
      if (typeof props.getOptions === 'function') {
        setLoading(true)
        if (debounce.current) {
          window.clearTimeout(debounce.current)
        }
        debounce.current = window.setTimeout(() => {
          props.getOptions(cleaned).then(newOptions => {
            if (cleaned != stateRef.current) {
              return
            }
            setOptions(newOptions)
            setLoading(false)
          })
        }, props.debounce)
      }
    }
    else {
      setOptions([])
      setLoading(false)
    }
  }
  const handleChange = (newValue) => {
    if (typeof props.onChange !== 'function') {
      return
    }
    if (newValue !== null && typeof newValue !== 'undefined') {
      const selected = basicOptions.find(option => {
        return option.value === newValue
      })
      if (selected) {
        newValue = selected
      }
      else {
        newValue = {
          value: newValue,
          label: `${newValue}`,
        }
      }
    }
    props.onChange(newValue)
  }
  const dropdownProps = {
    noOptionsPrompt: 'No options',
  }
  if (loading) {
    if (basicOptions.length > 0) {
      dropdownProps.afterOptions = (<li className="none">{props.loadingPrompt}</li>)
    }
    else {
      dropdownProps.noOptionsPrompt = props.loadingPrompt
    }
  }
  else if (props.value === null) {
    dropdownProps.noOptionsPrompt = props.searchPrompt
  }
  return (
    <Select
      {...props}
      options={basicOptions}
      value={basicValue}
      onTextChange={handleTextChange}
      onChange={handleChange}
      dropdownProps={dropdownProps}
      filter={false}
    />
  )
}
AsyncSelect.propTypes = {
  value: mirecoPropTypes.selectOption,
  onChange: PropTypes.func,
  getOptions: PropTypes.func.isRequired,
  loadingPrompt: PropTypes.string,
  searchPrompt: PropTypes.string,
  debounce: PropTypes.number,
}
AsyncSelect.defaultProps = {
  loadingPrompt: 'Loading...',
  searchPrompt: 'Type to search',
  debounce: 500,
}

export default AsyncSelect
