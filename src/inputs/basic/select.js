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
    })),
    placeholder: PropTypes.string,
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    nullable: true,
  }
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.textRef = React.createRef()
    this.dropdownRef = React.createRef()
    this.state = {
      ...this.state,
      searchTerm: '',
      inFocus: false,
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      // const bestValue = this.bestValue(this.state.searchTerm)
      // if (this.props.value !== bestValue) {
      //   this.setState({searchTerm: this.valueLabel(this.props.value)})
      // }
    }

  }
  filteredOptions = (searchTerm) => {
    return this.props.options.filter((option) => {
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
    })
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
    // if (typeof this.props.value === 'number') {
    //   let formatted = this.format(this.props, this.props.value)
    //   this.setState({
    //     textValue: formatted,
    //     inFocus: false,
    //   }, () => {
    //     if (typeof this.props.onChange === 'function') {
    //       this.props.onChange(this.props.value, true)
    //     }
    //   })
    // }
    // else {
    //   this.setState(prevState => {
    //     let updates = {
    //       inFocus: false,
    //     }
    //     if (this.props.autoErase) {
    //       updates.textValue = ''
    //     }
    //     return updates
    //   }, () => {
    //     if (typeof this.props.onChange === 'function') {
    //       if (this.props.autoErase) {
    //         this.props.onChange(null, true)
    //       }
    //       else {
    //         this.props.onChange(this.props.value, true)
    //       }
    //     }
    //   })
    // }
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
          style={{display: 'none'}}
        >
          {this.props.options.map((selectOption) => {
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
