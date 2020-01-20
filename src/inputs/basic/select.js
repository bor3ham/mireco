import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Text from './text.js'
import BlockDiv from '../../components/block-div.js'
import Dropdown from '../../components/dropdown.js'

const ARROW_DOWN = 40
const ARROW_UP = 38
const ENTER = 13

const valueType = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])

function validChoice(value, props) {
  return (
    typeof props.value === 'string'
    || typeof props.value === 'number'
    || typeof props.value === 'boolean'
  )
}

export default class Select extends React.PureComponent {
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
    let initialText = ''
    if (validChoice(this.props.value, this.props)) {
      const current = this.props.options.find(option => {
        return option.value === this.props.value
      })
      initialText = current ? current.label : `${this.props.value}`
    }
    this.state = {
      ...this.state,
      textValue: initialText,
      dropdownOpen: false,
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.value !== this.props.value ) {
      if (this.props.value === null) {
        this.setState({textValue: ''})
      }
      else if (validChoice(this.props.value, this.props)) {
        const filtered = this.getFilteredOptions()
        let current = filtered.find(option => {
          return (option.value === this.props.value)
        })
        if (!current) {
          current = this.props.options.find(option => {
            return (option.value === this.props.value)
          })
          if (current) {
            this.setState({textValue: current.label})
          }
          else {
            this.setState({textValue: `${this.props.value}`})
          }
        }
      }
    }
    if (this.props.disabled && !prevProps.disabled) {
      this.onBlur()
    }
  }
  getFilteredOptions = () => {
    const terms = this.state.textValue.split(' ').map(term => {
      return term.trim().toLowerCase()
    })
    return this.props.options.filter(option => {
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
  handleTextFocus = (event) => {
    this.setState({
      dropdownOpen: true,
    })
  }
  handleTextKeyDown = (event) => {
    if (event.which === ENTER ) {
      if (this.state.dropdownOpen) {
        const current = this.props.options.find(option => {
          return option.value === this.props.value
        })
        this.setState({dropdownOpen: false, textValue: current ? current.label : ''})
        event.preventDefault()
      }
      return
    }
    if (!this.state.dropdownOpen) {
      this.setState({dropdownOpen: true})
    }
    if (event) {
      if (event.which === ARROW_DOWN || event.which === ARROW_UP) {
        event.preventDefault()
        if (typeof this.props.onChange !== 'function') {
          return
        }
        let currentIndex = -1
        const filtered = this.getFilteredOptions()
        filtered.map((option, index) => {
          if (option.value === this.props.value) {
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
          this.props.onChange(filtered[nextIndex].value)
        }
        else {
          this.props.onChange(null)
        }
      }
    }
  }
  handleTextChange = (newValue) => {
    this.setState({textValue: newValue}, () => {
      if (typeof this.props.onChange !== 'function') {
        return
      }
      let cleaned = newValue.trim().toLowerCase()
      if (cleaned.length <= 0) {
        this.props.onChange(null, false)
      }
      else {
        let valueMatch = null
        this.props.options.map(option => {
          const optionValue = `${option.value}`.trim().toLowerCase()
          if (valueMatch === null && optionValue === cleaned) {
            valueMatch = option.value
          }
        })
        if (valueMatch !== null) {
          this.props.onChange(valueMatch, false)
        }
        else {
          let labelMatch = null
          this.props.options.map(option => {
            const optionLabel = `${option.label}`.trim().toLowerCase()
            if (labelMatch === null && optionLabel === cleaned) {
              labelMatch = option.value
            }
          })
          if (labelMatch !== null) {
            this.props.onChange(labelMatch, false)
          }
          else {
            const filtered = this.getFilteredOptions()
            const current = filtered.find(option => {
              return option.value === this.props.value
            })
            this.props.onChange(current ? current.value : undefined, false)
          }
        }
      }
    })
  }
  handleDropdownSelect = (value) => {
    const selected = this.props.options.find(option => {
      return option.value === value
    })
    if (!selected) {
      console.warn('Could not find selected value in options', value)
      return
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, true)
    }
    this.textRef.current && this.textRef.current.focus()
    this.setState({
      dropdownOpen: false,
      textValue: selected.label,
    })
  }
  onBlur = () => {
    if (validChoice(this.props.value, this.props)) {
      const selectedOption = this.props.options.find(option => {
        return option.value === this.props.value
      })
      let formatted = selectedOption ? selectedOption.label : `${this.props.value}`
      this.setState({
        textValue: formatted,
        dropdownOpen: false,
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.props.value, true)
        }
      })
    }
    else {
      this.setState({
        textValue: '',
        dropdownOpen: false,
      }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(null, true)
        }
      })
    }
  }
  render() {
    const filtered = this.getFilteredOptions()
    return (
      <BlockDiv
        ref={this.containerRef}
        block={this.props.block}
        className={classNames('MIRECO-select', {
          'has-value': !!this.props.value,
        })}
        tabIndex={-1}
        onBlur={this.handleContainerBlur}
      >
        <Text
          ref={this.textRef}
          placeholder={this.props.placeholder}
          value={this.state.textValue}
          onFocus={this.handleTextFocus}
          onKeyDown={this.handleTextKeyDown}
          onChange={this.handleTextChange}
          disabled={this.props.disabled}
          block={this.props.block}
        />
        {this.state.dropdownOpen && (
          <Dropdown
            ref={this.dropdownRef}
            options={filtered}
            value={this.props.value}
            onSelect={this.handleDropdownSelect}
          />
        )}
      </BlockDiv>
    )
  }
}
