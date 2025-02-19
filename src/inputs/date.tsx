import React, { useState, useRef, useEffect, useCallback, forwardRef, useMemo } from 'react'
import classNames from 'classnames'
import { addDays, subDays } from 'date-fns'

import { DayCalendar, WidgetBlock, DateTextRef, DateText } from 'components'
import Calendar from '../vectors/calendar.svg'
import type { DateInputValue, DateValue, DateFormatFunction, DateParseFunction } from 'types'
import { dateValueAsDate, dateAsDateValue } from 'types'
import { useInputKeyDownHandler } from 'hooks'

// todo: combine state into reducer
// todo: replace keydown with keypress

export interface DateProps {
  // mireco
  block?: boolean
  // date
  value?: DateInputValue
  onChange?(newValue: DateInputValue, wasBlur: boolean): void
  locale?: string
  format?: DateFormatFunction
  parse?: DateParseFunction
  autoErase?: boolean
  clearable?: boolean
  rightHang?: boolean
  placeholder?: string
  icon?: React.ReactNode
  textClassName?: string
  textId?: string
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
  locale,
  format,
  parse,
  autoErase = true,
  clearable = true,
  rightHang,
  placeholder,
  icon = <Calendar className="MIRECO-calendar" />,
  textClassName,
  size = 12,
  id,
  textId,
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
  const handleTextClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    setCalendarOpen(true)
    if (onClick) {
      onClick(event)
    }
  }, [onClick])
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
  const handleContainerClick = useCallback(() => {
    if (textRef.current) {
      textRef.current.focus()
    }
  }, [])

  const closeCalendar = useCallback(() => {
    setCalendarOpen(false)
  }, [])
  const clean = useCallback(() => {
    if (textRef.current) {
      textRef.current.cleanText()
    }
    closeCalendar()
  }, [closeCalendar])
  const recordFocus = useCallback(() => {
    setInFocus(true)
    setCalendarOpen(true)
  }, [])
  const [fallback, has] = useMemo(() => {
    let has = false
    let fallback = new Date()
    if (typeof value === 'string') {
      has = true
      fallback = dateValueAsDate(value)
    }
    return [fallback, has]
  }, [value])
  const decrement = useCallback(() => {
    if (onChange) {
      onChange(dateAsDateValue(subDays(fallback, has ? 1 : 0)), false)
    }
  }, [onChange, fallback, has])
  const increment = useCallback(() => {
    if (onChange) {
      onChange(dateAsDateValue(addDays(fallback, has ? 1 : 0)), false)
    }
  }, [onChange, fallback, has])
  const handleTextKeyDown = useInputKeyDownHandler(
    calendarOpen,
    closeCalendar,
    clean,
    recordFocus,
    decrement,
    increment,
  )

  const textRef = useRef<DateTextRef>(null)
  const handleSelectDay = useCallback((day: DateValue) => {
    if (onChange) {
      onChange(day, false)
    }
    if (textRef.current) {
      textRef.current.focus()
    }
    setCalendarOpen(false)
  }, [onChange])
  const daySelected = useCallback((day: DateValue) => (
    day === value
  ), [value])
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
    <WidgetBlock
      ref={containerRef}
      block={block}
      icon={icon}
      inFocus={inFocus}
      clearable={canClear}
      everClearable={clearable}
      onClear={handleClear}
      id={id}
      disabled={disabled}
      style={style}
      className={classNames(className, 'MIRECO-date')}
      onBlur={handleContainerBlur}
      onClick={handleContainerClick}
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
    >
      <DateText
        block
        ref={textRef}
        value={value}
        onFocus={handleTextFocus}
        onChange={handleTextChange}
        onTextChange={handleTextTextChange}
        onClick={handleTextClick}
        locale={locale}
        format={format}
        parse={parse}
        autoErase={autoErase}
        tabIndex={tabIndex}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        title={title}
        autoFocus={autoFocus}
        name={name}
        size={size}
        className={classNames('MIRECO-embedded', textClassName)}
        id={textId}
      />
      {inFocus && calendarOpen && !disabled && (
        <DayCalendar
          selectDay={handleSelectDay}
          value={value}
          className={classNames({
            'MIRECO-right-hang': rightHang,
          })}
          selected={daySelected}
        />
      )}
    </WidgetBlock>
  )
})

export { DateInput as Date }
