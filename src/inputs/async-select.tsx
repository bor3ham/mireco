import React, { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react'
import classNames from 'classnames'

import Spinner from '../vectors/spinner.svg'
import Chevron from '../vectors/chevron.svg'
import { isEmpty } from 'types'
import type { SelectOption, SelectValue, SelectOptionInputValue, Empty } from 'types'
import { Select, type SelectRef } from './select'

// todo: merge loading and inFocus state into reducer
// todo: double render flicker on using clear button

export interface AsyncSelectProps {
  // mireco
  block?: boolean
  // async select
  value?: SelectOptionInputValue
  getOptions(searchTerm: string): Promise<SelectOption[]>
  onChange?(newValue: SelectOptionInputValue, wasBlur: boolean): void
  loadingPrompt?: string
  searchPrompt?: string
  debounce?: number
  placeholder?: string
  size?: number
  clearable?: boolean
  autoComplete?: string
  // children specific
  textClassName?: string
  textId?: string
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

export const AsyncSelect = forwardRef<SelectRef, AsyncSelectProps>(({
  block,
  value,
  getOptions,
  onChange,
  loadingPrompt = 'Loading ...',
  searchPrompt = 'Type to search',
  debounce = 500,
  placeholder,
  size,
  clearable,
  autoComplete,
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
}, ref) => {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const debounceRef = useRef<number>()
  const searchedRef = useRef<string>('')

  // keep track of focus
  const [inFocus, setInFocus] = useState(false)
  const focusRef = useRef<boolean>(false)
  focusRef.current = inFocus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(true)
    if (onFocus) {
      onFocus(event)
    }
  }, [onFocus])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(false)
    setLoading(false)
    searchedRef.current = ''
    if (onBlur) {
      onBlur(event)
    }
  }, [onBlur])

  useEffect(() => {
    if (value === null) {
      setOptions([])
    }
  }, [
    value,
  ])

  const basicValue = useMemo(() => {
    if (!isEmpty(value)) {
      return value!.value
    }
    return value as Empty
  }, [
    value,
  ])
  const basicOptions = useMemo(() => {
    let b: SelectOption[] = []
    if (!loading) {
      b = [...options]
    }
    if (!isEmpty(basicValue)) {
      const valueOption = b.find(option => (
        option.value === basicValue
      ))
      if (!valueOption) {
        b = [...b, value!]
      }
    }
    return b
  }, [
    loading,
    options,
    value,
    basicValue,
  ])

  const handleTextChange = useCallback((newText: string) => {
    const cleaned = newText.trim()
    if (cleaned.length > 0) {
      if (getOptions) {
        searchedRef.current = cleaned
        setLoading(true)
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current)
        }
        debounceRef.current = window.setTimeout(() => {
          getOptions(cleaned).then((newOptions) => {
            if (cleaned !== searchedRef.current || !focusRef.current) {
              return
            }
            setOptions(newOptions)
            setLoading(false)
          })
        }, debounce)
      }
    } else {
      searchedRef.current = ''
      setOptions([])
      setLoading(false)
    }
  }, [
    getOptions,
    debounce,
  ])
  const handleChange = useCallback((newValue: SelectValue, wasBlur: boolean) => {
    if (!onChange) {
      return
    }
    let newOption: SelectOptionInputValue = null
    if (!isEmpty(newValue)) {
      const selected = basicOptions.find((option) => (
        option.value === newValue
      ))
      if (selected) {
        newOption = selected
      } else {
        newOption = {
          value: newValue!,
          label: `${newValue}`,
        }
      }
    }
    onChange(newOption, wasBlur)
  }, [
    onChange,
    basicOptions,
  ])
  const dropdownProps = useMemo(() => {
    const props: {
      noOptionsPrompt: string
      afterOptions?: React.ReactNode
    } = {
      noOptionsPrompt: 'No options',
    }
    if (loading) {
      if (basicOptions.length > 0) {
        props.afterOptions = (<li className="none">{loadingPrompt}</li>)
      } else {
        props.noOptionsPrompt = loadingPrompt
      }
    } else if (value === null) {
      props.noOptionsPrompt = searchPrompt
    }
    return props
  }, [
    loading,
    basicOptions,
    value,
    loadingPrompt,
    searchPrompt,
  ])
  
  return (
    <Select
      ref={ref}
      block={block}
      className={classNames(className, 'MIRECO-async-select')}
      options={basicOptions}
      value={basicValue}
      onTextChange={handleTextChange}
      onChange={handleChange}
      dropdownProps={dropdownProps}
      filter={false}
      icon={(loading && inFocus) ? <Spinner className="MIRECO-spinner" /> : <Chevron className="MIRECO-chevron" />}
      id={id}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={style}
      title={title}
      name={name}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      size={size}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      clearable={clearable}
      autoComplete={autoComplete}
    />
  )
})
