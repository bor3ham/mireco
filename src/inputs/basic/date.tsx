import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { parse, format, isValid, addDays, subDays } from 'date-fns'

import { DayCalendar, BlockDiv, WidgetText } from 'components'
import { CalendarVector } from 'vectors'
import {
  ISO_8601_DATE_FORMAT,
  KEYBOARD_ARROW_DOWN,
  KEYBOARD_ARROW_UP,
  KEYBOARD_ENTER,
  KEYBOARD_ESCAPE,
} from 'constants'
import type { DateValue } from 'types'

function formatValue(value: DateValue, displayFormat: string): string {
  if (value === null || typeof value === 'undefined') {
    return ''
  }
  return format(parse(value, ISO_8601_DATE_FORMAT, new Date()), displayFormat)
}

function parseValue(textValue: string, inputFormats: string[]): DateValue {
  let trimmed = textValue.trim()
  if (trimmed.length === 0) {
    return null
  }
  trimmed = trimmed.replace('\\', '/') // replace backslashes with forward
  trimmed = trimmed.replace(/\/+$/, '') // remove trailing slashes from consideration

  let valid: DateValue = undefined
  inputFormats.map((inputFormat) => {
    if (typeof valid !== 'undefined') {
      return
    }
    let parsed = parse(trimmed, inputFormat, new Date())
    if (isValid(parsed)) {
      valid = format(parsed, ISO_8601_DATE_FORMAT)
    }
  })
  return valid
}

export interface DateProps {
  // mireco
  block?: boolean
  // date
  value?: DateValue
  onChange?(newValue: DateValue, wasBlur: boolean): void
  displayFormat?: string
  inputFormats?: string[]
  autoErase?: boolean
  showClearButton?: boolean
  rightHang?: boolean
  placeholder?: string
  icon?: React.ReactNode
  textClassName?: string
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

const DateInput: React.FC<DateProps> = ({
  block,
  value = null,
  onChange,
  displayFormat = 'do MMM yyyy',
  inputFormats = [
    'd',
    'do',
    'd/MM',
    'do MMM',
    'do MMMM',
    'd/MM/yy',
    'd/MM/yyyy',
    'do MMM yy',
    'do MMM yyyy',
    'do MMMM yy',
    'do MMMM yyyy',
  ],
  autoErase = true,
  showClearButton = true,
  rightHang,
  placeholder = 'dd/mm/yyyy',
  icon = <CalendarVector />,
  textClassName,
  id,
  className,
  tabIndex,
  title,
  autoFocus,
  style,
  disabled,
  name,
  required,
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
  const [textValue, setTextValue] = useState<string>(formatValue(value, displayFormat))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'string') {
      const parsedCurrent = parseValue(textValueRef.current, inputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatValue(value, displayFormat))
      }
    }
  }, [
    value,
    inputFormats,
  ])
  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseValue(newValue, inputFormats), false)
    }
    setCalendarOpen(true)
  }, [onChange, inputFormats])
  
  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'string') {
      const formatted = formatValue(value, displayFormat)
      setTextValue(formatted)
      setInFocus(false)
      setCalendarOpen(false)
      if (onChange) {
        onChange(value, true)
      }
    } else {
      setInFocus(false)
      setCalendarOpen(false)
      if (autoErase) {
        if (onChange) {
          onChange(null, true)
        } else {
          setTextValue('')
        }
      } else {
        if (onChange) {
          onChange(value, true)
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
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  }, [
    disabled,
  ])

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(true)
    setCalendarOpen(true)
    if (onFocus) {
      onFocus(event)
    }
  }, [onFocus])

  const containerRef = useRef<HTMLDivElement>(null)
  const handleContainerBlur = useCallback((event: React.FocusEvent) => {
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
    handleBlur()
  }, [handleBlur])
  
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && (event.which === KEYBOARD_ENTER || event.which === KEYBOARD_ESCAPE)) {
      if (calendarOpen) {
        let formatted = formatValue(value, displayFormat)
        setTextValue(formatted)
        setCalendarOpen(false)
        event.preventDefault()
      }
      return
    }
    setInFocus(true)
    setCalendarOpen(true)
    if (event) {
      let current = new Date()
      if (typeof value === 'string') {
        current = parse(value, ISO_8601_DATE_FORMAT, new Date())
      }
      if (event.which === KEYBOARD_ARROW_DOWN) {
        event.preventDefault()
        if (onChange) {
          onChange(format(addDays(current, 1), ISO_8601_DATE_FORMAT), false)
        }
      }
      if (event.which === KEYBOARD_ARROW_UP) {
        event.preventDefault()
        if (onChange) {
          onChange(format(subDays(current, 1), ISO_8601_DATE_FORMAT), false)
        }
      }
      if (onKeyDown) {
        onKeyDown(event)
      }
    }
  }, [value, displayFormat, onChange, onKeyDown])
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setCalendarOpen(true)
    if (onClick) {
      onClick(event)
    }
  }, [onClick])
  const textRef = useRef<HTMLInputElement>(null)
  const handleSelectDay = useCallback((day: DateValue) => {
    if (onChange) {
      onChange(day, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    setCalendarOpen(false)
  }, [onChange])
  const handleClear = useCallback(() => {
    if (disabled) {
      return
    }
    if (onChange) {
      onChange(null, false)
      if (textRef.current) {
        textRef.current.focus()
      }
    }
  }, [
    disabled,
    onChange,
  ])
  const clearable = (
    typeof value === 'string' &&
    showClearButton &&
    !disabled
  )
  return (
    <BlockDiv
      ref={containerRef}
      block={block}
      className={classNames(
        'MIRECO-date',
        {
          'right-hang': rightHang,
          clearable,
        },
        className,
      )}
      tabIndex={-1}
      onBlur={handleContainerBlur}
      style={style}
    >
      <WidgetText
        icon={icon}
        onClear={clearable ? handleClear : undefined}
        id={id}
        ref={textRef}
        placeholder={placeholder}
        value={textValue}
        disabled={disabled}
        block={block}
        style={{marginBottom: '0'}}
        required={required}
        className={textClassName}
        title={title}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        name={name}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={onBlur}
        onClick={handleTextClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        onKeyDown={handleTextKeyDown}
        onKeyUp={onKeyUp}
      />
      {inFocus && calendarOpen && !disabled && (
        <DayCalendar
          selectDay={handleSelectDay}
          current={value}
        />
      )}
    </BlockDiv>
  )
}

export { DateInput as Date }
