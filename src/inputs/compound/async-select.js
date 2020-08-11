import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import Select from '../basic/select.js'
import { propTypes as mirecoPropTypes } from 'utilities'

function AsyncSelect(props) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchedTerm, setSearchedTerm] = useState('')
  const stateRef = useRef()

  stateRef.current = searchedTerm

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
    if (cleaned.length > 0) {
      if (typeof props.getOptions === 'function') {
        setSearchedTerm(cleaned)
        setLoading(true)
        props.getOptions(cleaned).then(newOptions => {
          if (cleaned != stateRef.current) {
            return
          }
          setOptions(newOptions)
          setLoading(false)
        })
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
  return (
    <Select
      {...props}
      options={basicOptions}
      value={basicValue}
      onTextChange={handleTextChange}
      onChange={handleChange}
    />
  )
}
AsyncSelect.propTypes = {
  value: mirecoPropTypes.selectOption,
  onChange: PropTypes.func,
  getOptions: PropTypes.func.isRequired,
}

export default AsyncSelect
