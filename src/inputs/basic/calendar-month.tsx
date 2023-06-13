import React, { useState, useCallback, useEffect, useRef } from 'react'
import classNames from 'classnames'

import { WidgetText, BlockDiv, MonthCalendar } from 'components'
import { CalendarVector } from 'vectors'
import { parseCalendarMonth, formatCalendarMonth, isCalendarMonthValue, CalendarMonthValue, calendarMonthInYear } from 'types'
import type { CalendarMonthInputValue } from 'types'

// todo: name / required with hidden form field
// todo: combine state into reducer

export interface CalendarMonthProps {
  // mireco
  block?: boolean
  // calendar month
  value?: CalendarMonthInputValue
  onChange?(newValue: CalendarMonthInputValue, wasBlur: boolean): void
  displayFormat?: string
  inputFormats?: string[]
  icon?: React.ReactNode
  placeholder?: string
  rightHang?: boolean
  clearable?: boolean
  // children specific
  textClassName?: string
  textStyle?: React.CSSProperties
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

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  block,
  value,
  onChange,
  displayFormat = 'MMMM',
  inputFormats = [
    'M',
    'MM',
    'MMM',
    'MMMM',
  ],
  icon = <CalendarVector />,
  placeholder,
  rightHang,
  clearable = true,
  textClassName,
  textStyle,
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
}) => {
  const [textValue, setTextValue] = useState(formatCalendarMonth(value, displayFormat))

  const [inFocus, setInFocus] = useState<boolean>(false)
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false)

  // respond to value changes
  useEffect(() => {
    if (value === null) {
      setTextValue('')
    } else if (isCalendarMonthValue(value)) {

      const parsedCurrent = parseCalendarMonth(textValue, inputFormats)
      if (parsedCurrent !== value) {
        setTextValue(formatCalendarMonth(value, displayFormat))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleBlur = useCallback(() => {
    setTextValue(formatCalendarMonth(value, displayFormat))
    if (onChange) {
      onChange(value, true)
    }
    setInFocus(false)
    setCalendarOpen(false)
  }, [
    value,
    displayFormat,
    onChange,
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

  const handleTextChange = useCallback((newValue: string) => {
    setTextValue(newValue)
    if (onChange) {
      onChange(parseCalendarMonth(newValue, inputFormats), false)
    }
  }, [
    onChange,
    inputFormats,
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
        const formatted = formatCalendarMonth(value, displayFormat)
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
        if (isCalendarMonthValue(value)) {
          let prev = value! - 1
          if (prev < 0) {
            prev = 11
          }
          onChange(prev, false)
        }
        else {
          onChange(11, false)
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (onChange) {
        if (isCalendarMonthValue(value)) {
          let next = value! + 1
          if (next > 11) {
            next = 0
          }
          onChange(next, false)
        }
        else {
          onChange(0, false)
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

  const textRef = useRef<HTMLInputElement>(null)
  const handleCalendarSelect = useCallback((newValue: CalendarMonthValue) => {
    if (onChange) {
      onChange(newValue, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    setCalendarOpen(false)
  }, [
    onChange,
  ])

  const handleTextClear = useCallback(() => {
    if (onChange) {
      onChange(null, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
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
    isCalendarMonthValue(value) &&
    clearable &&
    !disabled
  )

  return (
    <BlockDiv
      ref={containerRef}
      onBlur={handleContainerBlur}
      block={block}
      className={classNames(
        'MIRECO-calendar-month',
        {
          'right-hang': rightHang,
          clearable,
        },
        className,
      )}
      style={style}
      id={id}
    >
      <WidgetText
        ref={textRef}
        block={block}
        value={textValue}
        icon={icon}
        placeholder={placeholder}
        tabIndex={tabIndex}
        autoFocus={autoFocus}
        disabled={disabled}
        className={textClassName}
        style={textStyle}
        onClear={canClear ? handleTextClear : undefined}
        onChange={handleTextChange}
        onFocus={handleTextFocus}
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
        <MonthCalendar
          current={calendarMonthInYear(value)}
          onSelect={handleCalendarSelect}
        />
      )}
    </BlockDiv>
  )
}
