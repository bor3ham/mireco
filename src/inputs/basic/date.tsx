import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { parse, format, addDays, subDays } from 'date-fns'

import { DayCalendar, BlockDiv, WidgetText } from 'components'
import { CalendarVector } from 'vectors'
import {
  ISO_8601_DATE_FORMAT,
  KEYBOARD_ARROW_DOWN,
  KEYBOARD_ARROW_UP,
  KEYBOARD_ENTER,
  KEYBOARD_ESCAPE,
} from 'constants'
import { formatDate, parseDate } from 'types'
import type { DateInputValue, DateValue } from 'types'

// todo: combine state into reducer
// todo: replace keydown with keypress

export interface DateProps {
  // mireco
  block?: boolean
  // date
  value?: DateInputValue
  onChange?(newValue: DateInputValue, wasBlur: boolean): void
  displayFormat?: string
  /**
   * Ordered list of input formats, when parsing text will accept the first valid
   * result.
   * 
   * Note that input spaces are automatically replaced with slashes.
  */
  inputFormats?: string[]
  autoErase?: boolean
  clearable?: boolean
  rightHang?: boolean
  placeholder?: string
  icon?: React.ReactNode
  textClassName?: string
  size?: number
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
  value,
  onChange,
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
  clearable = true,
  rightHang,
  placeholder = 'dd / mm / yyyy',
  icon = <CalendarVector />,
  textClassName,
  size,
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
  const [textValue, setTextValue] = useState<string>(formatDate(value, displayFormat))
  const textValueRef = useRef<string>(textValue)
  textValueRef.current = textValue
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (typeof value === 'string') {
      const parsedCurrent = parseDate(textValueRef.current, inputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatDate(value, displayFormat))
      }
    }
  }, [
    value,
    inputFormats,
  ])
  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseDate(newValue, inputFormats), false)
    }
    setCalendarOpen(true)
  }, [onChange, inputFormats])
  
  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'string') {
      const formatted = formatDate(value, displayFormat)
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
        let formatted = formatDate(value, displayFormat)
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
  }, [calendarOpen, value, displayFormat, onChange, onKeyDown])
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
  const canClear = (
    typeof value === 'string' &&
    clearable &&
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
        onClear={canClear ? handleClear : undefined}
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
        size={size}
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
