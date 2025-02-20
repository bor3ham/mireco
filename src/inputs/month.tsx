import React, { forwardRef, useState, useCallback, useEffect, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'

import { WidgetText, type WidgetTextRef, BlockDiv, MonthCalendar } from 'components'
import Calendar from '../vectors/calendar.svg'
import { parseMonth, formatMonth, isMonthValue, calendarMonthInYear, prevMonth, nextMonth, dateAsMonth } from 'types'
import type { MonthInputValue, CalendarMonthValue } from 'types'

// todo: name / required with hidden form field
// todo: combine state into reducer
// todo: start up/down on current value same as date

export interface MonthRef {
  focus(): void
  element: HTMLDivElement | null
}

export interface MonthProps {
  // mireco
  block?: boolean
  marginless?: boolean
  // calendar month
  value?: MonthInputValue
  onChange?(newValue: MonthInputValue, wasBlur: boolean): void
  displayFormat?: string
  yearInputFormats?: string[]
  monthInputFormats?: string[]
  icon?: React.ReactNode
  placeholder?: string
  rightHang?: boolean
  clearable?: boolean
  autoComplete?: string
  size?: number
  // html
  id?: string
  className?: string
  tabIndex?: number
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

export const Month = forwardRef<MonthRef, MonthProps>(({
  block,
  marginless,
  value,
  onChange,
  displayFormat = 'MMMM yyyy',
  yearInputFormats = [
    'yy',
    'yyyy',
  ],
  monthInputFormats = [
    'M',
    'MM',
    'MMM',
    'MMMM',
  ],
  icon = <Calendar className="MIRECO-calendar" />,
  placeholder,
  rightHang,
  clearable = true,
  autoComplete,
  size = 13,
  id,
  className,
  tabIndex,
  autoFocus,
  style,
  disabled,
  // name,
  // required,
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
  const [textValue, setTextValue] = useState(formatMonth(value, displayFormat))

  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)

  // respond to value changes
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (isMonthValue(value)) {
      const parsedCurrent = parseMonth(textValue, yearInputFormats, monthInputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatMonth(value, displayFormat))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleBlur = useCallback(() => {
    setTextValue(formatMonth(value, displayFormat))
    if (onChange) {
      onChange(value, true)
    }
    setInFocus(false)
    setCalendarOpen(false)
    if (onBlur) {
      onBlur()
    }
  }, [
    value,
    displayFormat,
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

  const handleContainerBlur = useCallback((event: React.FocusEvent) => {
    handleBlur()
  }, [handleBlur])

  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseMonth(newValue, yearInputFormats, monthInputFormats), false)
    }
  }, [
    onChange,
    yearInputFormats,
    monthInputFormats,
  ])
  const handleTextFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setInFocus(true)
    setCalendarOpen(true)
    if (onFocus) {
      onFocus(event)
    }
  }, [
    onFocus,
  ])
  const handleTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && (event.key === 'Enter' || event.key === 'Escape')) {
      if (calendarOpen) {
        const formatted = formatMonth(value, displayFormat)
        setTextValue(formatted)
        setCalendarOpen(false)
        event.preventDefault()
      }
      return
    }
    setInFocus(true)
    setCalendarOpen(true)
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (onChange) {
        if (isMonthValue(value)) {
          onChange(prevMonth(value!), false)
        }
        else {
          const now = new Date()
          onChange(dateAsMonth(new Date(now.getFullYear(), 11)), false)
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (onChange) {
        if (isMonthValue(value)) {
          onChange(nextMonth(value!), false)
        }
        else {
          const now = new Date()
          onChange(dateAsMonth(new Date(now.getFullYear(), 0)), false)
        }
      }
    }
    if (onKeyDown) {
      onKeyDown(event)
    }
  }, [
    calendarOpen,
    displayFormat,
    onChange,
    value,
    onKeyDown,
  ])

  const textRef = useRef<WidgetTextRef>(null)
  const focus = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])
  const handleCalendarSelect = useCallback((month: CalendarMonthValue, year?: number) => {
    const useYear = typeof year !== 'undefined' ? year : (new Date()).getFullYear()
    if (onChange) {
      onChange(calendarMonthInYear(month, useYear), false)
    }
    focus()
    setCalendarOpen(false)
  }, [
    onChange,
  ])

  const handleTextClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
    }
    focus()
  }, [
    onChange,
  ])
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setCalendarOpen(true)
    if (onClick) {
      onClick(event)
    }
  }, [
    onClick,
  ])

  const canClear = (
    isMonthValue(value) &&
    clearable &&
    !disabled
  )

  useImperativeHandle(forwardedRef, () => ({
    focus,
    element: textRef.current ? textRef.current.element : null,
  }), [focus])

  return (
    <WidgetText
      ref={textRef}
      block={block}
      marginless={marginless}
      value={textValue}
      icon={icon}
      placeholder={placeholder}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      disabled={disabled}
      className={classNames('MIRECO-month', className)}
      inFocus={inFocus}
      id={id}
      style={style}
      autoComplete={autoComplete}
      size={size}
      onClear={canClear ? handleTextClear : undefined}
      onChange={handleTextChange}
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
      onContainerBlur={handleContainerBlur}
    >
      {inFocus && calendarOpen && !disabled && (
        <MonthCalendar
          current={value}
          onSelect={handleCalendarSelect}
          showYears
          className={classNames({
            'MIRECO-right-hang': rightHang,
          })}
        />
      )}
    </WidgetText>
  )
})
