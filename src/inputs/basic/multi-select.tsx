import React, { useRef, useReducer, useCallback, useEffect } from 'react'
import classNames from 'classnames'

import { BlockDiv, Dropdown, ClearButton } from 'components'
import { ChevronDownVector } from 'vectors'
import {
  KEYBOARD_ARROW_DOWN,
  KEYBOARD_ARROW_UP,
  KEYBOARD_ENTER,
  KEYBOARD_ESCAPE,
  KEYBOARD_BACKSPACE,
  KEYBOARD_TAB,
  KEYBOARD_SHIFT,
  KEYBOARD_CAPS,
} from 'constants'
import type { SelectValue, SelectOption } from 'types'
import { Text } from './text'

// todo: add hidden form element using name

type MultiSelectState = {
  dropdownOpen: boolean
  inFocus: boolean
  text: string
  selected: SelectValue | null
}

type MultiSelectAction =
  | { type: 'close' }
  | { type: 'open' }
  | { type: 'textFilter', text: string }
  | { type: 'select', value: SelectValue | null }
  | { type: 'focus' }
  | { type: 'blur' }

function multiSelectReducer(state: MultiSelectState, action: MultiSelectAction): MultiSelectState {
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
    default: {
      return state
    }
  }
}

interface SelectedOptionProps {
  label: string
  remove(): void
  disabled?: boolean
}

const SelectedOption: React.FC<SelectedOptionProps> = ({
  label,
  remove,
  disabled,
}) => (
  <li className="option">
    {label}
    <ClearButton onClick={remove} spaced={false} disabled={disabled} />
  </li>
)

export interface MultiSelectProps {
  // mireco
  block?: boolean
  // multi select
  value?: SelectValue[]
  options?: SelectOption[]
  onChange?(newValue: SelectValue[], wasBlur: boolean): void
  filter?: boolean
  icon?: React.ReactNode
  placeholder?: string
  textClassName?: string
  onTextChange?(newValue: string): string
  dropdownProps?: any
  // html
  id?: string
  style?: React.CSSProperties
  className?: string
  autoFocus?: boolean
  // form
  disabled?: boolean
  required?: boolean
  // name?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  block,
  value = [],
  options = [],
  onChange,
  filter = true,
  icon = <ChevronDownVector />,
  placeholder,
  textClassName,
  onTextChange,
  dropdownProps,
  id,
  style,
  className,
  autoFocus,
  disabled,
  required,
  // name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLInputElement>(null)

  const [state, dispatchState] = useReducer(multiSelectReducer, {
    dropdownOpen: false,
    inFocus: false,
    text: '',
    selected: null,
  })
  const onBlur = useCallback(() => {
    dispatchState({
      type: 'blur',
    })
  }, [])

  // respond to disabled change
  useEffect(() => {
    if (disabled) {
      onBlur()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])

  const addValue = useCallback((adding: SelectValue) => {
    if (onChange) {
      onChange([...new Set([
        ...value || [],
        adding,
      ])], true)
    }
  }, [
    onChange,
    value,
  ])
  const removeAt = useCallback((index: number) => {
    if (disabled) {
      return
    }
    if (onChange) {
      const updated = [...value || []]
      updated.splice(index, 1)
      onChange(updated, false)
      if (textRef.current) {
        textRef.current.focus()
      }
    }
  }, [
    disabled,
    onChange,
    value,
  ])
  const clearAll = useCallback(() => {
    if (disabled) {
      return
    }
    if (onChange) {
      onChange([], false)
      dispatchState({
        type: 'textFilter',
        text: '',
      })
      if (textRef.current) {
        textRef.current.focus()
      }
    }
  }, [disabled, onChange])
  const getFilteredOptions = useCallback((search: string) => {
    const terms = search.split(' ').map((term: string) => (
      term.trim().toLowerCase()
    )).filter((term: string) => (
      term.length > 0
    ))
    return (options || []).filter((option) => {
      if ((value || []).indexOf(option.value) !== -1) {
        return false
      }
      if (terms.length === 0 || !filter) {
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
  }, [options, value, filter])
  const handleContainerBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
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
  }, [onBlur])
  const handleTextFocus = useCallback(() => {
    dispatchState({type: 'focus'})
  }, [])
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!event || event.which === KEYBOARD_SHIFT || event.which === KEYBOARD_CAPS) {
      return
    }
    if (event.which === KEYBOARD_ENTER || (event.which === KEYBOARD_TAB && state.selected !== null)) {
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
    if (!state.dropdownOpen && event.which !== KEYBOARD_ESCAPE) {
      dispatchState({
        type: 'open',
      })
    }
    if (event.which === KEYBOARD_BACKSPACE && state.text === '') {
      if (onChange) {
        onChange((value || []).splice(0, (value || []).length - 1), false)
      }
    }
    if (event.which === KEYBOARD_ARROW_DOWN || event.which === KEYBOARD_ARROW_UP) {
      event.preventDefault()
      if (!onChange) {
        return
      }
      let currentIndex = -1
      const filtered = getFilteredOptions(state.text)
      if (!filtered.length) {
        return
      }
      filtered.forEach((option, index) => {
        if (option.value === state.selected) {
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
    if (event.which === KEYBOARD_ESCAPE) {
      if (state.dropdownOpen) {
        dispatchState({
          type: 'close',
        })
      }
    }
  }, [
    addValue,
    value,
    onChange,
    state,
    getFilteredOptions,
  ])
  const handleTextChange = useCallback((newValue: string) => {
    dispatchState({
      type: 'textFilter',
      text: newValue,
    })
    if (onTextChange) {
      onTextChange(newValue)
    }
    if (!onChange) {
      return
    }
    const cleaned = newValue.trim().toLowerCase()
    if (cleaned.length <= 0) {
      dispatchState({
        type: 'select',
        value: null,
      })
    }
    else {
      let valueMatch: SelectValue | null = null
      options.forEach((option) => {
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
        let labelMatch: SelectValue | null = null
        options.forEach((option) => {
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
          const current = filtered.find(option => (
            option.value === state.selected
          ))
          const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
          dispatchState({
            type: 'select',
            value: current ? current.value : (firstFilteredValue || null),
          })
        }
      }
    }
  }, [
    onTextChange,
    onChange,
    options,
    getFilteredOptions,
    state.selected,
  ])
  const handleContainerClick = useCallback(() => {
    if (disabled) {
      return
    }
    if (!state.dropdownOpen) {
      if (textRef.current) {
        if (textRef.current === document.activeElement) {
          dispatchState({
            type: 'open',
          })
        } else if (textRef.current) {
          textRef.current.focus()
        }
      }
    }
  }, [
    disabled,
    state,
  ])
  const handleDropdownSelect = useCallback((newValue: string) => {
    const selected = options.find(option => option.value === newValue)
    if (!selected) {
      return
    }
    addValue(newValue)
    if (textRef.current) {
      textRef.current.focus()
    }
    dispatchState({
      type: 'close',
    })
  }, [
    options,
    addValue,
  ])

  const filtered = getFilteredOptions(state.text)
  const hasValue = (value || []).length > 0
  const clearable = hasValue && !disabled
  return (
    <BlockDiv
      ref={containerRef}
      block={block}
      className={classNames('MIRECO-multi-select', {
        'has-value': hasValue,
        'in-focus': state.inFocus,
        disabled,
        clearable,
      }, className)}
      onBlur={handleContainerBlur}
      onClick={handleContainerClick}
      tabIndex={-1}
    >
      <ul className="selected">
        {(value || []).map((selectedValue, valueIndex) => {
          const selected = options.find((option) => option.value === selectedValue)
          const remove = () => {
            removeAt(valueIndex)
          }
          return (
            <SelectedOption
              key={`selected-${selectedValue}`}
              label={selected ? selected.label : `${selectedValue}`}
              remove={remove}
              disabled={disabled}
            />
          )
        })}
        <li className="text">
          <Text
            ref={textRef}
            placeholder={placeholder}
            value={state.text}
            onFocus={handleTextFocus}
            onKeyDown={handleTextKeyDown}
            onChange={handleTextChange}
            disabled={disabled}
            block={block}
            style={style}
            autoFocus={autoFocus}
            className={textClassName}
            id={id}
            required={required}
          />
        </li>
      </ul>
      {clearable && (
        <ClearButton onClick={clearAll} />
      )}
      {icon}
      {state.dropdownOpen && !disabled && (
        <Dropdown
          options={filtered}
          value={state.selected}
          onSelect={handleDropdownSelect}
          {...dropdownProps}
        />
      )}
    </BlockDiv>
  )
}
