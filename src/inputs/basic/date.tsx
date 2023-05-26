import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { parse, format, isValid, addDays, subDays } from 'date-fns'

import { DayCalendar, BlockDiv, WidgetText } from 'components'
import { CalendarVector } from 'vectors'
import { ISO_8601_DATE_FORMAT } from 'constants'
import type { DateValue } from 'types'

const ARROW_DOWN = 40
const ARROW_UP = 38
const ENTER = 13
const ESCAPE = 27

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

interface Props {
  // mireco
  block?: boolean
  // date
  value: DateValue
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
}

const DateInput: React.FC<Props> = ({
  block,
  value,
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
}) => {
  const [textValue, setTextValue] = useState<string>(formatValue(value, displayFormat))
  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)

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

  const handleBlur = useCallback(() => {
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
  }, [
    value,
    displayFormat,
    onChange,
    autoErase,
  ])
  useEffect(() => {
    if (disabled) {
      handleBlur()
    }
  }, [
    disabled,
  ])

  const handleFocus = useCallback(() => {
    setInFocus(true)
    setCalendarOpen(true)
  }, [])

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
  
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event && (event.which === ENTER || event.which === ESCAPE)) {
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
      if (event.which === ARROW_DOWN) {
        event.preventDefault()
        if (onChange) {
          onChange(format(addDays(current, 1), ISO_8601_DATE_FORMAT), false)
        }
      }
      if (event.which === ARROW_UP) {
        event.preventDefault()
        if (onChange) {
          onChange(format(subDays(current, 1), ISO_8601_DATE_FORMAT), false)
        }
      }
    }
  }, [value, displayFormat, onChange])
  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseValue(newValue, inputFormats), false)
    }
    setCalendarOpen(true)
  }, [onChange, inputFormats])
  const handleTextClick = useCallback(() => {
    setCalendarOpen(true)
  }, [])
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
        onChange={handleTextChange}
        onClick={handleTextClick}
        onFocus={handleFocus}
        disabled={disabled}
        onKeyDown={handleTextKeyDown}
        block={block}
        style={{marginBottom: '0'}}
        required={required}
        className={textClassName}
        title={title}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        name={name}
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
