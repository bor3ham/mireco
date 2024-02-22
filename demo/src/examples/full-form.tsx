import React, { useState, useCallback } from 'react'
import {
  Text,
  Textarea,
  Checkbox,
  Number,
  type NumberInputValue,
  Range,
  Button,
  Time,
  type TimeInputValue,
  Duration,
  type DurationInputValue,
  Date,
  type DateInputValue,
  Month,
  type MonthInputValue,
  CalendarMonth,
  type CalendarMonthInputValue,
  Datetime,
  type DatetimeInputValue,
  DateRange,
  type DateRangeInputValue,
  DatetimeRange,
  type DatetimeRangeInputValue,
} from 'mireco'
import casual from 'casual-browserify'

import {
  getRandomCalendarMonth,
  getRandomText,
  getRandomTextarea,
  getRandomCheckbox,
  getRandomDate,
  getRandomDateRange,
  getRandomDatetime,
  getRandomDuration,
  getRandomNumber,
  getRandomTime,
} from '../random'

const INITIAL_VALUE: {
  text: string
  textarea: string
  checkbox: boolean
  number: NumberInputValue
  range: number
  time: TimeInputValue
  duration: DurationInputValue
  date: DateInputValue
  month: MonthInputValue
  calendarMonth: CalendarMonthInputValue
  datetime: DatetimeInputValue
  dateRange: DateRangeInputValue
  datetimeRange: DatetimeRangeInputValue
} = {
  text: '',
  textarea: '',
  checkbox: false,
  number: null,
  range: 1,
  time: null,
  duration: null,
  date: null,
  month: null,
  calendarMonth: null,
  datetime: null,
  dateRange: {
    start: null,
    end: null,
  },
  datetimeRange: null,
}

const randomValue = () => ({
  ...INITIAL_VALUE,
  text: casual.coin_flip ? getRandomText() : '',
  textarea: casual.coin_flip ? getRandomTextarea() : '',
  checkbox: getRandomCheckbox(),
  number: casual.coin_flip ? getRandomNumber() : null,
  time: casual.coin_flip ? getRandomTime() : null,
  duration: casual.coin_flip ? getRandomDuration() : null,
  date: casual.coin_flip ? getRandomDate() : null,
  calendarMonth: casual.coin_flip ? getRandomCalendarMonth() : null,
  datetime: casual.coin_flip ? getRandomDatetime() : null,
  dateRange: casual.random_element([
    null,
    {
      start: getRandomDate(),
      end: null,
    },
    {
      start: null,
      end: getRandomDate(),
    },
    getRandomDateRange(),
  ]),
})

const randomFill = () => ({
  ...INITIAL_VALUE,
  text: getRandomText(),
  textarea: getRandomTextarea(),
  checkbox: true,
  number: getRandomNumber(),
  time: getRandomTime(),
  duration: getRandomDuration(),
  date: getRandomDate(),
  calendarMonth: getRandomCalendarMonth(),
  datetime: getRandomDatetime(),
  dateRange: getRandomDateRange(),
})

export const FullFormExample = () => {
  const [value, setValue] = useState(INITIAL_VALUE)
  const setValueField = useCallback((field: string, newValue: any) => {
    setValue(prev => ({
      ...prev,
      [field]: newValue,
    }))
  }, [])
  const handleTextChange = useCallback((newValue: string) => {
    setValueField('text', newValue)
  }, [setValueField])
  const handleTextareaChange = useCallback((newValue: string) => {
    setValueField('textarea', newValue)
  }, [setValueField])
  const handleCheckboxChange = useCallback((newValue: boolean) => {
    setValueField('checkbox', newValue)
  }, [setValueField])
  const handleNumberChange = useCallback((newValue: NumberInputValue) => {
    setValueField('number', newValue)
  }, [setValueField])
  const handleRangeChange = useCallback((newValue: number) => {
    setValueField('range', newValue)
  }, [setValueField])
  const handleTimeChange = useCallback((newValue: TimeInputValue) => {
    setValueField('time', newValue)
  }, [setValueField])
  const handleDurationChange = useCallback((newValue: DurationInputValue) => {
    setValueField('duration', newValue)
  }, [setValueField])
  const handleDateChange = useCallback((newValue: DateInputValue) => {
    setValueField('date', newValue)
  }, [setValueField])
  const handleMonthChange = useCallback((newValue: MonthInputValue) => {
    setValueField('month', newValue)
  }, [setValueField])
  const handleCalendarMonthChange = useCallback((newValue: CalendarMonthInputValue) => {
    setValueField('calendarMonth', newValue)
  }, [setValueField])
  const handleDatetimeChange = useCallback((newValue: DatetimeInputValue) => {
    setValueField('datetime', newValue)
  }, [setValueField])
  const handleDateRangeChange = useCallback((newValue: DateRangeInputValue) => {
    setValueField('dateRange', newValue)
  }, [setValueField])
  const handleDatetimeRangeChange = useCallback((newValue: DatetimeRangeInputValue) => {
    setValueField('datetimeRange', newValue)
  }, [setValueField])

  const reset = useCallback(() => {
    setValue(INITIAL_VALUE)
  }, [])
  const randomise = useCallback(() => {
    setValue(randomValue())
  }, [])
  const fill = useCallback(() => {
    setValue(randomFill())
  }, [])

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    console.log('Submitting', value)
  }, [value])
  return (
    <form className="lab-controls" onSubmit={handleFormSubmit}>
      <Text
        block
        value={value.text}
        onChange={handleTextChange}
        placeholder="Text"
      />
      <Textarea
        block
        value={value.textarea}
        onChange={handleTextareaChange}
        placeholder="Textarea"
      />
      <Checkbox
        block
        value={value.checkbox}
        onChange={handleCheckboxChange}
      >
        Checkbox
      </Checkbox>
      <Number
        block
        value={value.number}
        onChange={handleNumberChange}
        placeholder="Number"
      />
      <Range
        block
        value={value.range}
        onChange={handleRangeChange}
      />
      <Time
        block
        value={value.time}
        onChange={handleTimeChange}
        placeholder="Time"
      />
      <Duration
        block
        value={value.duration}
        onChange={handleDurationChange}
        placeholder="Duration"
      />
      <Date
        block
        value={value.date}
        onChange={handleDateChange}
        placeholder="Date"
      />
      <Month
        block
        value={value.month}
        onChange={handleMonthChange}
        placeholder="Month"
      />
      <CalendarMonth
        block
        value={value.calendarMonth}
        onChange={handleCalendarMonthChange}
        placeholder="Calendar Month"
      />
      <Datetime
        block
        value={value.datetime}
        onChange={handleDatetimeChange}
      />
      <DateRange
        block
        value={value.dateRange}
        onChange={handleDateRangeChange}
      />
      <DatetimeRange
        block
        value={value.datetimeRange}
        onChange={handleDatetimeRangeChange}
      />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <div>
          <Button type="button" className="secondary" onClick={reset}>Reset</Button>
          {' '}
          <Button type="button" className="secondary" onClick={randomise}>Randomise</Button>
          {' '}
          <Button type="button" className="secondary" onClick={fill}>Fill</Button>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
