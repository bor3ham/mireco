import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import classNames from 'classnames'
import { parse, format, addDays, subDays } from 'date-fns'

import { DayCalendar, BlockDiv, WidgetDateText, DateTextHandle } from 'components'
import { CalendarVector } from 'vectors'
import {
  ISO_8601_DATE_FORMAT,
} from 'constants'
import { formatDate } from 'types'
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

const DateInput = forwardRef<HTMLInputElement, DateProps>(({
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
}, forwardedRef) => {
  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
  const handleBlur = useCallback((event?: React.FocusEvent<HTMLInputElement>) => {
    if (typeof value === 'string') {
      setInFocus(false)
      setCalendarOpen(false)
      if (onChange) {
        onChange(value, true)
      }
    } else {
      setInFocus(false)
      setCalendarOpen(false)
    }
    if (onBlur) {
      onBlur(event)
    }
  }, [
    value,
    onChange,
    onBlur,
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

  const handleTextChange = useCallback((newValue: DateInputValue) => {
    if (onChange) {
      onChange(newValue, false)
    }
  }, [onChange])
  const handleTextTextChange = useCallback(() => {
    setCalendarOpen(true)
  }, [])
  const handleTextFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
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
        containerRef.current.contains(event.relatedTarget) ||
        containerRef.current === event.relatedTarget
      )
    ) {
      // ignore internal blur
      return
    }
    handleBlur()
  }, [handleBlur])
  
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      if (calendarOpen) {
        const formatted = formatDate(value, displayFormat)
        if (textRef.current) {
          textRef.current.setText(formatted)
        }
        setCalendarOpen(false)
        event.preventDefault()
      }
      return
    }
    setInFocus(true)
    setCalendarOpen(true)
    let wasEmpty = true
    let current = new Date()
    if (typeof value === 'string') {
      wasEmpty = false
      current = parse(value, ISO_8601_DATE_FORMAT, new Date())
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (onChange) {
        onChange(format(addDays(current, wasEmpty ? 0 : 1), ISO_8601_DATE_FORMAT), false)
      }
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (onChange) {
        onChange(format(subDays(current, wasEmpty ? 0 : 1), ISO_8601_DATE_FORMAT), false)
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [calendarOpen, value, displayFormat, onChange, onKeyDown])
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setCalendarOpen(true)
    if (onClick) {
      onClick(event)
    }
  }, [onClick])
  const textRef = useRef<DateTextHandle>(null)
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
      <WidgetDateText
        block={block}
        value={value}
        onChange={handleTextChange}
        onTextChange={handleTextTextChange}
        displayFormat={displayFormat}
        inputFormats={inputFormats}
        autoErase={autoErase}
        icon={icon}
        onClear={canClear ? handleClear : undefined}
        everClearable={clearable}
        id={id}
        ref={textRef}
        placeholder={placeholder}
        disabled={disabled}
        style={{marginBottom: '0'}}
        required={required}
        autoComplete={autoComplete}
        className={textClassName}
        title={title}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        name={name}
        size={size}
        onFocus={handleTextFocus}
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
})

export { DateInput as Date }
