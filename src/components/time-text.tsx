import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

import { Text } from 'inputs'
import { formatTime, parseTime, type TimeInputValue } from 'types'

export interface TimeTextProps {
  // mireco
  block?: boolean
  // time
  value?: TimeInputValue
  onChange?(newValue: TimeInputValue): void
  onTextChange?(newValue: string): void
  inputFormats?: string[]
  longFormat?: string
  displayFormat?: string
  simplify?: boolean
  placeholder?: string
  textClassName?: string
  autoErase?: boolean
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

export interface TimeTextHandle {
  focus(): void
  setText(newText: string): void
}

export const TimeText = forwardRef<TimeTextHandle, TimeTextProps>(({
  block,
  value,
  onChange,
  onTextChange,
  inputFormats = [
    'h:mm:ss a',
    'h:mm:ssa',
    'h:mm:ss',
    'h:mm a',
    'H:mm:ss',
    'H:mm',
    'h:mma',
    'h:mm',
    'h a',
    'H:mm',
    'H',
    'ha',
    'h',
  ],
  longFormat = 'h:mm:ss a',
  displayFormat = 'h:mm a',
  simplify = false,
  placeholder = 'hh : mm',
  textClassName,
  autoErase = true,
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
  const [textValue, setTextValue] = useState<string>(formatTime(value, inputFormats, longFormat, displayFormat, simplify))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue

  // respond to value change
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'number') {
      const parsedCurrent = parseTime(textValueRef.current, inputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatTime(value, inputFormats, longFormat, displayFormat, simplify))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
  ])

  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'number') {
      const formatted = formatTime(value, inputFormats, longFormat, displayFormat, simplify)
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
      onChange(parseTime(newValue, inputFormats))
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
      className={textClassName}
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
