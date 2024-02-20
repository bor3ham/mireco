import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

import { Text } from 'inputs'
import { formatDate, parseDate, type DateInputValue } from 'types'

export interface DateTextProps {
  // mireco
  block?: boolean
  // date
  value?: DateInputValue
  onChange?(newValue: DateInputValue): void
  onTextChange?(newValue: string): void
  displayFormat?: string
  /**
   * Ordered list of input formats, when parsing text will accept the first valid
   * result.
   * 
   * Note that input spaces are automatically replaced with slashes.
  */
  inputFormats?: string[]
  autoErase?: boolean
  placeholder?: string
  size?: number
  initialText?: string
  // html
  id?: string
  className?: string
  tabIndex?: number
  title?: string
  autoFocus?: boolean
  style?: React.CSSProperties
  // form
  disabled?: boolean
  name?: string
  required?: boolean
  autoComplete?: string
  // event handlers
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void
  onBlur?(event?: React.FocusEvent<HTMLInputElement>): void
  onClick?(event: React.MouseEvent<HTMLInputElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLInputElement>): void  
  onMouseMove?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLInputElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLInputElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLInputElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLInputElement>): void
}

export interface DateTextHandle {
  focus(): void
  setText(newText: string): void
}

export const DateText = forwardRef<DateTextHandle, DateTextProps>(({
  block,
  value,
  onChange,
  onTextChange,
  displayFormat = 'do MMM yyyy',
  inputFormats = [
    'd',
    'do',
    'd/MM',
    'do/MMM',
    'do/MMMM',
    'd/MM/yy',
    'd/MM/yyyy',
    'do/MMM/yy',
    'do/MMM/yyyy',
    'do/MMMM/yy',
    'do/MMMM/yyyy',
  ],
  autoErase = true,
  placeholder = 'dd / mm / yyyy',
  size,
  initialText,
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
  disabled,
  name,
  required,
  autoComplete,
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
  const [textValue, setTextValue] = useState<string>(formatDate(value, displayFormat))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue

  // respond to value change
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'string') {
      const parsedCurrent = parseDate(textValueRef.current, inputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatDate(value, displayFormat))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
  ])

  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'string') {
      const formatted = formatDate(value, displayFormat)
      setTextValue(formatted)
    } else {
      if (autoErase) {
        if (onChange) {
          onChange(null)
        } else {
          setTextValue('')
        }
      }
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    value,
    displayFormat,
    onChange,
    autoErase,
    onBlur,
  ])

  const textRef = useRef<HTMLInputElement>(null)
  const handleChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseDate(newValue, inputFormats))
    }
    if (onTextChange) {
      onTextChange(newValue)
    }
  }, [onChange, inputFormats])

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (textRef.current) {
        textRef.current.focus()
      }
    },
    setText: (newText: string) => {
      setTextValue(newText)
    }
  }), [])
  
  // on first mount
  useEffect(() => {
    if (autoFocus && typeof initialText !== 'undefined') {
      if (textRef.current) {
        textRef.current.focus()
      }
      handleChange(initialText)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <Text
      id={id}
      ref={textRef}
      placeholder={placeholder}
      value={textValue}
      disabled={disabled}
      block={block}
      style={{marginBottom: '0'}}
      required={required}
      autoComplete={autoComplete}
      className={className}
      title={title}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      name={name}
      size={size}
      onChange={handleChange}
      onFocus={onFocus}
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
    />
  )
})
