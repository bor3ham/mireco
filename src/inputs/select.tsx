import React, { forwardRef, useRef, useCallback, useReducer, useEffect, useMemo } from 'react'
import classNames from 'classnames'

import { BlockDiv, Dropdown, WidgetText } from 'components'
import { ChevronDownVector } from 'vectors'
import { SelectInputValue, SelectOption, isEmpty } from 'types'
import { KEYBOARD_ARROW_DOWN, KEYBOARD_ARROW_UP, KEYBOARD_ENTER, KEYBOARD_ESCAPE } from 'constants'

// todo: differentiate between text filtering and keyboard nav

type SelectState = {
  dropdownOpen: boolean
  text: string
  filtering: boolean
}

type SelectAction =
  | { type: 'close', formatted: string }
  | { type: 'open' }
  | { type: 'textFilter', text: string }
  | { type: 'textOverride', text: string }

function selectReducer(state: SelectState, action: SelectAction): SelectState {
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
    default: {
      return state
    }
  }
}

export interface SelectProps {
  // mireco
  block?: boolean
  // select
  value?: SelectInputValue
  options?: SelectOption[]
  onChange?(newValue: SelectInputValue, wasBlur: boolean): void
  nullable?: boolean
  filter?: boolean
  onTextChange?(newValue: string, event: React.ChangeEvent<HTMLInputElement>): void
  icon?: React.ReactNode
  dropdownProps?: any
  placeholder?: string
  size?: number
  clearable?: boolean
  autoComplete?: string
  // children specific
  textClassName?: string
  textStyle?: React.CSSProperties
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: React.CSSProperties
  className?: string
  title?: string
  // form
  name?: string
  required?: boolean
  disabled?: boolean
  // event handlers
  onFocus?(event?: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLDivElement>): void
  onClick?(event: React.MouseEvent<HTMLDivElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLDivElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLDivElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLDivElement>): void
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(({
  block,
  value,
  options = [],
  onChange,
  nullable = true,
  filter = true,
  onTextChange,
  icon = <ChevronDownVector />,
  dropdownProps,
  placeholder = 'Select',
  size,
  clearable = true,
  autoComplete,
  textClassName,
  textStyle,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  name,
  required,
  disabled,
  onFocus,
  onBlur,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onKeyDown,
  onKeyUp,
}, forwardedRef) => {
  const findOption = useCallback((choiceValue: SelectInputValue) => (
    options.find((option) => (option.value === choiceValue))
  ), [
    options,
  ])
  const getFilteredOptions = useCallback((search: string) => {
    const terms = search.split(' ').map((term: string) => (
      term.trim().toLowerCase()
    )).filter((term: string) => (
      (term.length > 0)
    ))
    return options.filter((option: SelectOption) => {
      if (terms.length === 0) {
        return true
      }
      const searchable = `${option.label}${option.value}`.toLowerCase()
      let match = false
      terms.forEach((term) => {
        if (searchable.indexOf(term) !== -1) {
          match = true
        }
      })
      return match
    })
  }, [
    options,
  ])
  const findMatchingValue = useCallback((stringValue: string) => {
    let valueMatch: SelectInputValue = null
    options.forEach((option) => {
      const optionValue = `${option.value}`.trim().toLowerCase()
      if (valueMatch === null && optionValue === stringValue) {
        valueMatch = option.value
      }
    })
    if (valueMatch !== null) {
      return valueMatch
    }
    let labelMatch: SelectInputValue = null
    options.forEach((option) => {
      const optionLabel = `${option.label}`.trim().toLowerCase()
      if (labelMatch === null && optionLabel === stringValue) {
        labelMatch = option.value
      }
    })
    if (labelMatch !== null) {
      return labelMatch
    }
    const filtered = filter ? getFilteredOptions(stringValue) : options
    const current = filtered.find(option => (option.value === value))
    const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
    return current ? current.value : firstFilteredValue
  }, [
    options,
    value,
    filter,
    getFilteredOptions,
  ])

  const valueOption = useMemo(() => (findOption(value)), [findOption, value])
  let initialText = ''
  if (!isEmpty(value)) {
    initialText = valueOption ? valueOption.label : `${value}`
  }
  const [state, dispatchState] = useReducer(selectReducer, {
    text: initialText,
    dropdownOpen: false,
    filtering: false,
  })

  const lastNonEmptyValue = useRef<SelectInputValue>(value || null)
  // respond to value change
  useEffect(() => {
    if (value === null) {
      dispatchState({
        type: 'textOverride',
        text: '',
      })
    } else if (!isEmpty(value)) {
      const overrideWithValueText = () => {
        dispatchState({
          type: 'textOverride',
          text: valueOption ? valueOption.label : `${value}`,
        })
      }
      if (!state.dropdownOpen) {
        overrideWithValueText()
      } else if (!filter) {
        const current = findMatchingValue(`${value}`.trim().toLowerCase())
        if (!current) {
          overrideWithValueText()
        }
      }
    }
    // record last valid value for non-nullable reset
    if (!isEmpty(value)) {
      lastNonEmptyValue.current = value
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
  ])
  // respond to options change
  const optionsStr = useMemo(() => (options.map((option) => (`${option.value}`)).join(',')), [options])
  useEffect(() => {
    if (state.text === '') {
      return
    }
    const matching = findMatchingValue(state.text.trim().toLowerCase())
    if (onChange) {
      onChange(matching, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    optionsStr,
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLInputElement>()
  const handleBlur = useCallback((event?: React.FocusEvent<HTMLDivElement>) => {
    if (valueOption) {
      const formatted = valueOption ? valueOption.label : `${value}`
      dispatchState({
        type: 'close',
        formatted,
      })
      if (onChange) {
        onChange(value, true)
      }
    }
    else {
      dispatchState({
        type: 'close',
        formatted: '',
      })
      if (onChange) {
        onChange(nullable ? null : lastNonEmptyValue.current, true)
      }
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    valueOption,
    value,
    onChange,
    nullable,
    onBlur,
  ])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current
      && (
        containerRef.current.contains(event.relatedTarget) ||
        containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    handleBlur(event)
  }, [
    handleBlur,
  ])
  const handleTextFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    dispatchState({type: 'open'})
    if (onFocus) {
      onFocus(event)
    }
  }, [onFocus])
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!event) {
      return
    }
    if (event.which === KEYBOARD_ENTER ) {
      if (state.dropdownOpen) {
        dispatchState({
          type: 'close',
          formatted: valueOption ? valueOption.label : '',
        })
        event.preventDefault()
      }
      return
    }
    if (!state.dropdownOpen && event.which !== KEYBOARD_ESCAPE) {
      dispatchState({
        type: 'open',
      })
    }
    if (event.which === KEYBOARD_ARROW_DOWN || event.which === KEYBOARD_ARROW_UP) {
      event.preventDefault()
      if (onChange) {
        let currentIndex = -1
        const filtered = (state.filtering && filter) ? getFilteredOptions(state.text) : options
        if (filtered.length) {
          filtered.forEach((option, index) => {
            if (option.value === value) {
              currentIndex = index
            }
          })
          let nextIndex = currentIndex
          if (event.which === KEYBOARD_ARROW_DOWN) {
            nextIndex++
            if (nextIndex >= filtered.length) {
              nextIndex = 0
            }
          }
          if (event.which === KEYBOARD_ARROW_UP) {
            nextIndex--
            if (nextIndex < 0) {
              nextIndex = filtered.length - 1
            }
          }
          if (filtered[nextIndex]) {
            onChange(filtered[nextIndex].value, false)
          }
          else {
            onChange(nullable ? null : undefined, false)
          }
        }
      }
    }
    if (event.which === KEYBOARD_ESCAPE) {
      if (state.dropdownOpen) {
        let formatted = ''
        if (valueOption) {
          formatted = valueOption ? valueOption.label : `${value}`
        }
        dispatchState({
          type: 'close',
          formatted,
        })
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [
    value,
    state,
    valueOption,
    onChange,
    filter,
    getFilteredOptions,
    options,
    nullable,
    onKeyDown,
  ])
  const handleTextChange = useCallback((newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchState({
      type: 'textFilter',
      text: newValue,
    })
    if (onChange) {
      const cleaned = newValue.trim().toLowerCase()
      if (cleaned.length <= 0) {
        onChange(nullable ? null : undefined, false)
      } else {
        const matching = findMatchingValue(cleaned)
        onChange(matching, false)
      }
    }
    if (onTextChange) {
      onTextChange(newValue, event)
    }
  }, [
    onChange,
    nullable,
    findMatchingValue,
    onTextChange,
  ])
  const handleTextClick = useCallback(() => {
    dispatchState({
      type: 'open',
    })
  }, [])
  const handleDropdownSelect = useCallback((newValue: SelectInputValue) => {
    const selected = options.find((option) => (
      option.value === newValue
    ))
    if (!selected) {
      return
    }
    if (onChange) {
      onChange(newValue, true)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    dispatchState({
      type: 'close',
      formatted: selected.label,
    })
  }, [
    options,
    onChange,
  ])

  // respond to disabled change
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disabled,
  ])

  const handleClear = useCallback(() => {
    if (disabled) {
      return
    }
    if (onChange) {
      onChange(nullable ? null : undefined, false)
    } else {
      dispatchState({
        type: 'textFilter',
        text: '',
      })
    }
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [
    disabled,
    onChange,
    nullable,
  ])

  const filtered = useMemo(() => (
    state.filtering && filter ? getFilteredOptions(state.text) : options
  ), [
    state.filtering,
    filter,
    getFilteredOptions,
    state.text,
    options,
  ])
  const hasValue = !isEmpty(value)
  const canClear = clearable && hasValue && !disabled && nullable

  const handleFormElementChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTextValue = event.target.value
    const newValue = options.find((option) => (`${option.value}` === newTextValue))
    if (onChange) {
      onChange(newValue ? newValue.value : undefined, false)
    }
  }, [options, onChange])
  const formElement = useMemo(() => (
    <select
      name={name}
      value={`${value}`}
      onChange={handleFormElementChange}
      hidden
    >
      {nullable && (
        <option key="option-null" value="">-</option>
      )}
      {options.map((option) => (
        <option
          value={`${option.value}`}
          key={`option-${option.value}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  ), [
    name,
    value,
    handleFormElementChange,
    options,
    nullable,
  ])

  return (
    <BlockDiv
      ref={containerRef}
      block={block}
      className={classNames('MIRECO-select', {
        'has-value': hasValue,
        clearable: canClear,
      }, className)}
      style={style}
      onBlur={handleContainerBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyUp={onKeyUp}
    >
      <WidgetText
        ref={(instance: HTMLInputElement) => {
          textRef.current = instance
          if (typeof forwardedRef === "function") {
            forwardedRef(instance)
          } else if (forwardedRef !== null) {
            // eslint-disable-next-line no-param-reassign
            forwardedRef.current = instance
          }
        }}
        placeholder={placeholder}
        value={state.text}
        onFocus={handleTextFocus}
        onKeyDown={handleTextKeyDown}
        onChange={handleTextChange}
        onClick={handleTextClick}
        disabled={disabled}
        block={block}
        style={textStyle}
        autoFocus={autoFocus}
        className={textClassName}
        id={id}
        icon={icon}
        onClear={canClear ? handleClear : undefined}
        everClearable={clearable}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
        title={title}
        required={required}
        size={size}
      />
      {formElement}
      {state.dropdownOpen && (
        <Dropdown
          options={filtered}
          value={value}
          onSelect={handleDropdownSelect}
          {...dropdownProps}
        />
      )}
    </BlockDiv>
  )
})
