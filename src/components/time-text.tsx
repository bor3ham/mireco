import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react'

import { Text } from 'inputs'
import type { TimeInputValue, TimeFormatFunction, TimeParseFunction } from 'types'
import { getSafeLocale } from 'constants'
import {
  formatTime as defaultFormat,
  parseTime as defaultParse,
  TIME_PLACEHOLDERS,
} from 'locale'

export interface TimeTextProps {
  // mireco
  block?: boolean
  // time
  value?: TimeInputValue
  onChange?(newValue: TimeInputValue): void
  onTextChange?(newValue: string): void
  locale?: string
  format?: TimeFormatFunction
  parse?: TimeParseFunction
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
  cleanText(): void
}

export const TimeText = forwardRef<TimeTextHandle, TimeTextProps>(({
  block,
  value,
  onChange,
  onTextChange,
  locale,
  format = defaultFormat,
  parse = defaultParse,
  simplify = false,
  placeholder,
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
  const [textValue, setTextValue] = useState<string>(format(value, locale, simplify))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue

  // respond to value change
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'number') {
      const parsedCurrent = parse(textValueRef.current, locale)
      if (parsedCurrent !== value) {
        setTextValue(format(value, locale, simplify))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value,
  ])

  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'number') {
      const formatted = format(value, locale, simplify)
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
    locale,
    simplify,
    format,
    autoErase,
    onChange,
    onBlur,
  ])

  const textRef = useRef<HTMLInputElement>(null)
  const handleChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parse(newValue, locale))
    }
    if (onTextChange) {
      onTextChange(newValue)
    }
  }, [onChange, locale])

  const focus = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  const setText = useCallback((newText: string) => {
    setTextValue(newText)
  }, [])
  const cleanText = useCallback(() => {
    const clean = format(value, locale, simplify)
    setText(clean)
  }, [
    format,
    value,
    locale,
    simplify,
    setText,
  ])

  useImperativeHandle(ref, () => ({
    focus,
    setText,
    cleanText,
  }), [
    focus,
    setText,
    cleanText,
  ])
  
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

  const fallbackPlaceholder = useMemo(() => {
    if (typeof placeholder === 'string') return placeholder
    const safeLocale = getSafeLocale(locale)
    return TIME_PLACEHOLDERS[safeLocale]
  }, [placeholder, locale])
  
  return (
    <Text
      id={id}
      ref={textRef}
      placeholder={fallbackPlaceholder}
      value={textValue}
      disabled={disabled}
      block={block}
      style={{
        marginBottom: '0',
        ...style,
      }}
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
