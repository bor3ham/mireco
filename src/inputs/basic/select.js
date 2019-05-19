import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Text } from 'inputs'
import { BlockDiv, Dropdown } from 'components'

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])

export default class Select extends React.Component {
  static propTypes = {
    value: valueType,
    nullable: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: valueType,
      label: PropTypes.string,
    })).isRequired,
    placeholder: PropTypes.string,
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    nullable: true,
    options: [],
  }
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
    this.dropdownRef = React.createRef()
    this.hiddenInputRef = React.createRef()
    this.state = {
      ...this.state,
      searchTerm: '',
      inFocus: false,
    }
  }
  componentDidUpdate(prevProps, prevState) {
  }
  filteredOptions = (searchTerm) => {
    return this.props.options.filter((option) => {
      return this.filterOption(option, searchTerm)
    })
  }
  filterOption = (option, searchTerm) => {
    const term = searchTerm.toLowerCase().trim()
    if (term.length === 0) {
      return true
    }
    const searchText = `${option.label}${option.value}`.toLowerCase()
    const terms = term.split(' ')
    let allFound = true
    terms.map((subTerm) => {
      if (searchText.indexOf(subTerm) === -1) {
        allFound = false
      }
    })
    return allFound
  }
  bestValue = (term) => {
    const filtered = this.filteredOptions(term)
    if (filtered.length > 0) {
      return filtered[0]
    }
    return null
  }
  valueLabel = (value) => {
    const found = this.props.options.find((option) => {
      return option.value === value
    })
    if (found) {
      return found.label
    }
    return ''
  }
  handleFocus = () => {
    this.setState({inFocus: true})
  }
  handleSearchKeyDown = (event) => {
    this.setState({inFocus: true})
    if (event) {
      if (event.which === 40) {
        event.preventDefault()
        this.dropdownRef.current && this.dropdownRef.current.selectNext()
      }
      if (event.which === 38) {
        event.preventDefault()
        this.dropdownRef.current && this.dropdownRef.current.selectPrevious()
      }
      if (
        event.which === 8
        && this.state.searchTerm.length === 0
        && typeof this.props.onChange === 'function'
      ) {
        this.props.onChange(null)
      }
    }
  }
  handleSearchChange = (newValue) => {
    this.setState({searchTerm: newValue}, () => {
      if (typeof this.props.onChange !== 'function') {
        return
      }
      const first = this.filteredOptions(newValue)
      if (first.length > 0) {
        this.props.onChange(first[0].value)
      }
    })
  }
  handleSelect = (value) => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, false)
    }
    this.textRef.current && this.textRef.current.focus()
  }
  handleHiddenInputChange = () => {
    if (this.hiddenInputRef.current) {
      let value = this.hiddenInputRef.current.value
      if (value === '') {
        value = null
      }
      this.handleSelect(value)
    }
  }
  handleContainerBlur = (event) => {
    if (
      this.containerRef.current
      && this.containerRef.current.divRef.current
      && (
        this.containerRef.current.divRef.current.contains(event.relatedTarget)
        || this.containerRef.current.divRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    this.onBlur()
  }
  onBlur = () => {
    this.setState({inFocus: false, searchTerm: ''})
    // todo: different onChange for blur events?
  }
  render() {
    const filteredOptions = this.filteredOptions(this.state.searchTerm)
    return (
      <BlockDiv
        ref={this.containerRef}
        className={classNames('MIRECO-select', {
          'has-value': !!this.props.value,
        })}
        block={this.props.block}
        onBlur={this.handleContainerBlur}
      >
        <Text
          ref={this.textRef}
          placeholder={this.props.value ? this.valueLabel(this.props.value) : this.props.placeholder}
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
          block={this.props.block}
          onFocus={this.handleFocus}
          onKeyDown={this.handleSearchKeyDown}
          disabled={this.props.disabled}
        />
        {this.state.inFocus && !this.props.disabled && (
          <Dropdown
            ref={this.dropdownRef}
            options={filteredOptions}
            value={this.props.value}
            onSelect={this.handleSelect}
          />
        )}
        <select
          ref={this.hiddenInputRef}
          style={{display: 'none'}}
          value={this.props.value || ''}
          onChange={this.handleHiddenInputChange}
          disabled={this.props.disabled}
        >
          {this.props.nullable && <option key="-" value="">-</option>}
          {this.props.options.filter((selectOption) => {
            return (
              selectOption.value === this.props.value
              || this.filterOption(selectOption, this.state.searchTerm)
            )
          }).map((selectOption) => {
            return (
              <option
                key={selectOption.value}
                value={selectOption.value}
              >
                {selectOption.label}
              </option>
            )
          })}
        </select>
      </BlockDiv>
    )
  }
}
