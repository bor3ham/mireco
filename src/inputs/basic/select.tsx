import React, { useRef, useCallback, useReducer, useEffect, useMemo } from 'react'
import classNames from 'classnames'

import { BlockDiv, Dropdown, WidgetText } from 'components'
import { ChevronDownVector } from 'vectors'
import { SelectValue, SelectOption } from 'types'
import { KEYBOARD_ARROW_DOWN, KEYBOARD_ARROW_UP, KEYBOARD_ENTER, KEYBOARD_ESCAPE } from 'constants'

function nonEmptyValue(value: SelectValue) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

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
  }
}

interface SelectProps {
  // mireco
  block?: boolean
  // select
  value?: SelectValue
  options?: SelectOption[]
  onChange?(newValue: SelectValue, wasBlur: boolean): void
  nullable?: boolean
  filter?: boolean
  onTextChange?(newValue: string, event: React.ChangeEvent<HTMLInputElement>): void
  icon?: React.ReactNode
  dropdownProps?: any
  placeholder?: string
  size?: number
  // children specific
  textClassName?: string
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

export const Select: React.FC<SelectProps> = ({
  block,
  value,
  options = [],
  onChange,
  nullable = true,
  filter = true,
  onTextChange,
  icon = <ChevronDownVector />,
  dropdownProps,
  placeholder,
  size,
  textClassName,
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
}) => {
  const lastNonEmptyValue = useRef<SelectValue>(value ? value : null)
  useEffect(() => {
    if (nonEmptyValue(value)) {
      lastNonEmptyValue.current = value
    }
  }, [value])

  const findOption = useCallback((choiceValue: SelectValue) => {
    return options.find((option) => (option.value === choiceValue))
  }, [
    options,
  ])
  const getFilteredOptions = useCallback((search: string) => {
    const terms = search.split(' ').map((term: string) => {
      return term.trim().toLowerCase()
    }).filter((term: string) => {
      return (term.length > 0)
    })
    return options.filter((option: SelectOption) => {
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
  }, [
    options,
  ])

  const valueOption = findOption(value)
  let initialText = ''
  if (nonEmptyValue(value)) {
    initialText = valueOption ? valueOption.label : `${value}`
  }
  const [state, dispatchState] = useReducer(selectReducer, {
    text: initialText,
    dropdownOpen: false,
    filtering: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLInputElement>(null)
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
          filtered.map((option, index) => {
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
      let cleaned = newValue.trim().toLowerCase()
      if (cleaned.length <= 0) {
        onChange(nullable ? null : undefined, false)
      } else {
        let valueMatch: SelectValue = null
        options.forEach((option) => {
          const optionValue = `${option.value}`.trim().toLowerCase()
          if (valueMatch === null && optionValue === cleaned) {
            valueMatch = option.value
          }
        })
        if (valueMatch !== null) {
          onChange(valueMatch, false)
        } else {
          let labelMatch: SelectValue = null
          options.forEach((option) => {
            const optionLabel = `${option.label}`.trim().toLowerCase()
            if (labelMatch === null && optionLabel === cleaned) {
              labelMatch = option.value
            }
          })
          if (labelMatch !== null) {
            onChange(labelMatch, false)
          } else {
            const filtered = filter ? getFilteredOptions(newValue) : options
            const current = filtered.find(option => {
              return option.value === value
            })
            const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
            onChange(current ? current.value : firstFilteredValue, false)
          }
        }
      }
      if (onTextChange) {
        onTextChange(newValue, event)
      }
    }
  }, [
    onChange,
    nullable,
    options,
    filter,
    getFilteredOptions,
    onTextChange,
  ])
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    dispatchState({
      type: 'open',
    })
  }, [])
  const handleDropdownSelect = useCallback((newValue: SelectValue) => {
    const selected = options.find((option) => {
      return option.value === newValue
    })
    if (!selected) {
      console.warn('Could not find selected value in options', newValue)
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

  const setTextFromPropValue = useCallback(() => {
    if (valueOption) {
      dispatchState({
        type: 'textOverride',
        text: valueOption.label,
      })
    }
    else {
      dispatchState({
        type: 'textOverride',
        text: `${value}`,
      })
    }
  }, [
    valueOption,
    value,
  ])
  useEffect(() => {
    if (value === null) {
      dispatchState({
        type: 'textOverride',
        text: '',
      })
    } else if (nonEmptyValue(value)) {
      if (!state.dropdownOpen) {
        setTextFromPropValue()
      } else {
        const filtered = filter ? getFilteredOptions(state.text) : options
        const current = filtered.find(option => {
          return (option.value === value)
        })
        if (!current) {
          setTextFromPropValue()
        }
      }
    }
  }, [
    value,
  ])
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  }, [
    disabled,
  ])

  const handleClear = useCallback(() => {
    if (disabled) {
      return
    }
    if (onChange) {
      onChange(nullable ? null : undefined, false)
    }
    dispatchState({
      type: 'textFilter',
      text: '',
    })
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
  const hasValue = nonEmptyValue(value)
  const clearable = hasValue && !disabled && nullable

  const handleFormElementChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTextValue = event.target.value
    const newValue = options.find((option) => (`${option.value}` === newTextValue))
    if (onChange) {
      onChange(newValue ? newValue.value : undefined, false)
    }
  }, [options, onChange])
  const formElement = useMemo(() => {
    return (
      <select
        name={name}
        value={`${value}`}
        onChange={handleFormElementChange}
        hidden
      >
        {nullable && (
          <option key={`option-null`} value="">-</option>
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
    )
  }, [
    name,
    value,
    handleFormElementChange,
    options,
  ])

  return (
    <BlockDiv
      ref={containerRef}
      block={block}
      className={classNames('MIRECO-select', {
        'has-value': hasValue,
        clearable,
      }, className)}
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
        ref={textRef}
        placeholder={placeholder}
        value={state.text}
        onFocus={handleTextFocus}
        onKeyDown={handleTextKeyDown}
        onChange={handleTextChange}
        onClick={handleTextClick}
        disabled={disabled}
        block={block}
        style={style}
        autoFocus={autoFocus}
        className={textClassName}
        id={id}
        icon={icon}
        onClear={clearable ? handleClear : undefined}
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
}
