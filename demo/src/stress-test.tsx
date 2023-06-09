import React, { useState, useCallback, useEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  Button,
  Checkbox,
  Date as DateInput,
  Duration,
  Number as NumberInput,
  Range,
  Select,
  Text,
  Textarea,
  Time,
  Datetime,
  DatetimeRange,
  MultiSelect,
  CalendarMonth,
  Month,
  ISO_8601_DATE_FORMAT,
  dateAsMonth,
} from 'mireco'
import type {
  DateInputValue,
  DurationInputValue,
  NumberInputValue,
  RangeInputValue,
  SelectInputValue,
  TimeInputValue,
  DatetimeInputValue,
  // DatetimeRangeInputValue,
  SelectOption,
  MonthInputValue,
  CalendarMonthInputValue,
} from 'mireco'
import casual from 'casual-browserify'
import beautify from 'json-beautify'
import Cookies from 'js-cookie'
import { startOfDay, startOfHour, addDays, addHours, addMinutes, format } from 'date-fns'

import ResizeContainer from './resize-container'

const replacer: any = null // json-beautify bad typing workaround

const SELECT_OPTIONS = [
  {value: 'car', label: 'Car'},
  {value: 'boot', label: 'Car Boot'},
  {value: 'bike', label: 'Bicycle'},
  {value: 'plane', label: 'Aeroplane'},
  {value: 'hike', label: 'Hiking'},
  {value: 'glider', label: 'Hanglider'},
  {value: 'jetski', label: 'Jetski'},
  {value: 'tumbling', label: 'Tumbling Down Hill'},
  {value: 'walking', label: 'Walking'},
  {value: 'bouncing', label: 'Bouncing Off the Walls'},
]

interface FormValue {
  calendarMonth: CalendarMonthInputValue
  checked: boolean
  date: DateInputValue
  datetime: DatetimeInputValue
  datetimeRange: any // DatetimeRangeValue
  duration: DurationInputValue
  month: MonthInputValue
  multiSelect: SelectOption[]
  number: NumberInputValue
  range: RangeInputValue
  select: SelectInputValue
  text: string
  textarea: string
  time: TimeInputValue
}

const defaultValue: FormValue = {
  calendarMonth: null,
  checked: false,
  date: null,
  datetime: +(new Date()),
  datetimeRange: null,
  duration: null,
  month: null,
  multiSelect: [],
  number: null,
  range: 50,
  select: null,
  text: 'hi there',
  textarea: 'Wow this is two lines...\nIn this text box',
  time: null,
}

function randomValue(): FormValue {
  return {
    calendarMonth: casual.coin_flip ? null : casual.integer(0, 11),
    checked: !!casual.coin_flip,
    date: casual.coin_flip ? null : format(
      addDays(startOfDay(new Date()), casual.integer(-30, 30)),
      ISO_8601_DATE_FORMAT,
    ),
    datetime: casual.coin_flip ? null : +addDays(new Date(), casual.integer(-10, 10)),
    datetimeRange: casual.coin_flip ? null : {
      start: +addHours(
        startOfHour(new Date()),
        casual.integer(-3 * 24, 3 * 24)
      ),
      end: +addHours(
        startOfHour(new Date()),
        casual.integer(4 * 24, 7 * 24)
      ),
    },
    duration: casual.coin_flip ? null : +addMinutes(0, casual.integer(0, 400) * 30),
    month: casual.coin_flip ? null : dateAsMonth(addDays(startOfDay(new Date()), casual.integer(-30, 30))),
    multiSelect: casual.coin_flip ? [] : [...new Set([
      casual.random_element(SELECT_OPTIONS).value,
      casual.random_element(SELECT_OPTIONS).value,
      casual.random_element(SELECT_OPTIONS).value,
    ])],
    number: casual.coin_flip ? null : casual.integer(0, 100),
    range: casual.integer(0, 100),
    select: casual.coin_flip ? null : casual.random_element(SELECT_OPTIONS).value,
    text: casual.title,
    textarea: casual.description,
    time: casual.coin_flip ? null : casual.integer(0, 24 * 60) * 60 * 1000,
  }
}

const useFlag = (key: string): [boolean, (newValue: boolean) => void, () => void] => {
  const [value, setValue] = useState(!!Cookies.get(key))
  const handleChange = useCallback((newValue: boolean) => {
    setValue(newValue)
    if (newValue) {
      Cookies.set(key, 'true')
    } else {
      Cookies.remove(key)
    }
  }, [key])
  const toggle = useCallback(() => {
    setValue((prevValue) => (!prevValue))
  }, [])
  return [value, handleChange, toggle]
}

const StressTest = () => {
  const [disabled, handleDisabledChange, toggleDisabled] = useFlag('disabled')
  const [intervalDisable, handleIntervalDisableChange] = useFlag('intervalDisable')
  const [intervalRandomise, handleIntervalRandomiseChange] = useFlag('intervalRandomise')
  const [intervalRemount, handleIntervalRemountChange] = useFlag('intervalRemount')
  const [blockMode, handleBlockModeChange] = useFlag('blockMode')

  const [showCalendarMonth, handleShowCalendarMonthChange] = useFlag('showCalendarMonth')
  const [showCheckbox, handleShowCheckboxChange] = useFlag('showCheckbox')
  const [showDate, handleShowDateChange] = useFlag('showDate')
  const [showDuration, handleShowDurationChange] = useFlag('showDuration')
  const [showMonth, handleShowMonthChange] = useFlag('showMonth')
  const [showMultiSelect, handleShowMultiSelectChange] = useFlag('showMultiSelect')
  const [showNumber, handleShowNumberChange] = useFlag('showNumber')
  const [showRange, handleShowRangeChange] = useFlag('showRange')
  const [showSelect, handleShowSelectChange] = useFlag('showSelect')
  const [showText, handleShowTextChange] = useFlag('showText')
  const [showTextarea, handleShowTextareaChange] = useFlag('showTextarea')
  const [showTime, handleShowTimeChange] = useFlag('showTime')

  const [showDatetime, handleShowDatetimeChange] = useFlag('showDatetime')
  const [showDatetimeRange, handleShowDatetimeRangeChange] = useFlag('showDatetimeRange')

  const [mountIndex, setMountIndex] = useState<number>(0)
  const remount = useCallback(() => {
    setMountIndex((prevIndex) => (prevIndex + 1))
  }, [])

  const [formValue, setFormValue] = useState({...defaultValue})
  const handleFieldChange = useCallback((fieldKey: string) => {
    return (newValue: any) => {
      setFormValue((prevValue) => ({
        ...prevValue,
        [fieldKey]: newValue,
      }))
    }
  }, [])
  const randomise = useCallback(() => {
    setFormValue(randomValue())
  }, [])
  const reset = useCallback(() => {
    setFormValue({...defaultValue})
  }, [])

  const handleInterval = useCallback(() => {
    if (intervalDisable) {
      toggleDisabled()
    }
    if (intervalRandomise) {
      randomise()
    }
    if (intervalRemount) {
      remount()
    }
  }, [
    intervalDisable,
    toggleDisabled,
    intervalRandomise,
    randomise,
    intervalRemount,
    remount,
  ])
  useEffect(() => {
    const interval = window.setInterval(handleInterval, 3000)
    return () => {
      window.clearInterval(interval)
    }
  }, [handleInterval])

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    alert('submitting value!')
  }, [])
  
  let inlineSpace
  if (!blockMode) {
    inlineSpace = (<span>{' '}</span>)
  }

  return (
    <div>
      <style>{`
        body {
          padding: 0;
          margin: 0;
        }
        div.flag-column {
          flex: 1;
          min-width: 10rem;
        }
      `}</style>
      <div style={{
        background: '#464656',
        color: '#fff',
        padding: '3rem',
      }}>
        <h1>Mireco demo form</h1>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div className="flag-column">
            <h2>Form settings</h2>
            <Checkbox
              block
              value={blockMode}
              onChange={handleBlockModeChange}
            >
              Block mode
            </Checkbox>
            <Checkbox
              block
              value={disabled}
              onChange={handleDisabledChange}
            >
              Disabled
            </Checkbox>
          </div>
          <div className="flag-column">
            <h2>Interval changes</h2>
            <Checkbox
              block
              value={intervalDisable}
              onChange={handleIntervalDisableChange}
            >
              Periodically disable
            </Checkbox>
            <Checkbox
              block
              value={intervalRandomise}
              onChange={handleIntervalRandomiseChange}
            >
              Periodically randomise
            </Checkbox>
            <Checkbox
              block
              value={intervalRemount}
              onChange={handleIntervalRemountChange}
            >
              Periodically remount
            </Checkbox>
          </div>
          <div className="flag-column">
            <h2>Basic inputs</h2>
            <Checkbox
              block
              value={showCalendarMonth}
              onChange={handleShowCalendarMonthChange}
            >
              Show calendar month input
            </Checkbox>
            <Checkbox
              block
              value={showCheckbox}
              onChange={handleShowCheckboxChange}
            >
              Show checkbox input
            </Checkbox>
            <Checkbox
              block
              value={showDate}
              onChange={handleShowDateChange}
            >
              Show date input
            </Checkbox>
            <Checkbox
              block
              value={showDuration}
              onChange={handleShowDurationChange}
            >
              Show duration input
            </Checkbox>
            <Checkbox
              block
              value={showMonth}
              onChange={handleShowMonthChange}
            >
              Show month input
            </Checkbox>
            <Checkbox
              block
              value={showMultiSelect}
              onChange={handleShowMultiSelectChange}
            >
              Show multi select input
            </Checkbox>
            <Checkbox
              block
              value={showNumber}
              onChange={handleShowNumberChange}
            >
              Show number input
            </Checkbox>
            <Checkbox
              block
              value={showRange}
              onChange={handleShowRangeChange}
            >
              Show range input
            </Checkbox>
            <Checkbox
              block
              value={showSelect}
              onChange={handleShowSelectChange}
            >
              Show select input
            </Checkbox>
            <Checkbox
              block
              value={showText}
              onChange={handleShowTextChange}
            >
              Show text input
            </Checkbox>
            <Checkbox
              block
              value={showTextarea}
              onChange={handleShowTextareaChange}
            >
              Show textarea input
            </Checkbox>
            <Checkbox
              block
              value={showTime}
              onChange={handleShowTimeChange}
            >
              Show time input
            </Checkbox>
          </div>
          <div className="flag-column">
            <h2>Compound inputs</h2>
            <Checkbox
              block
              value={showDatetime}
              onChange={handleShowDatetimeChange}
            >
              Show datetime input
            </Checkbox>
            <Checkbox
              block
              value={showDatetimeRange}
              onChange={handleShowDatetimeRangeChange}
            >
              Show datetime range input
            </Checkbox>
          </div>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <Button
            onClick={randomise}
            className="secondary"
          >
            Randomise
          </Button>
          {' '}
          <Button
            onClick={remount}
            className="secondary"
          >
            Remount
          </Button>
          {' '}
          <Button
            onClick={reset}
            className="secondary"
          >
            Reset
          </Button>
        </div>
      </div>
      <div style={{
        background: '#f5f5f5',
        padding: '3rem',
        margin: '0',
      }}>
        <h2>Form state value</h2>
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}>
          {beautify(formValue, replacer, 2, 80)}
        </pre>
      </div>
      <ResizeContainer>
        <form
          onSubmit={handleSubmit}
          key={`form-mount-${mountIndex}`}
          style={{margin: '20rem 1rem'}}
        >
          {/* basic */}
          {showCalendarMonth && (
            <CalendarMonth
              value={formValue.calendarMonth}
              onChange={handleFieldChange('calendarMonth')}
              disabled={disabled}
              block={blockMode}
              placeholder="Select calendar month"
            />
          )}
          {showCalendarMonth && inlineSpace}
          {showCheckbox && (
            <Checkbox
              value={formValue.checked}
              onChange={handleFieldChange('checked')}
              disabled={disabled}
              block={blockMode}
            >
              Checked or not?
            </Checkbox>
          )}
          {showCheckbox && inlineSpace}
          {showDate && (
            <DateInput
              value={formValue.date}
              onChange={handleFieldChange('date')}
              disabled={disabled}
              block={blockMode}
            />
          )}
          {showDate && inlineSpace}
          {showDuration && (
            <Duration
              value={formValue.duration}
              onChange={handleFieldChange('duration')}
              disabled={disabled}
              block={blockMode}
              placeholder="Enter a duration"
            />
          )}
          {showDuration && inlineSpace}
          {showMonth && (
            <Month
              value={formValue.month}
              onChange={handleFieldChange('month')}
              disabled={disabled}
              block={blockMode}
              placeholder="Select month"
            />
          )}
          {showMonth && inlineSpace}
          {showMultiSelect && (
            <MultiSelect
              value={formValue.multiSelect}
              options={SELECT_OPTIONS}
              onChange={handleFieldChange('multiSelect')}
              disabled={disabled}
              block={blockMode}
              placeholder="Select multiple values"
            />
          )}
          {showMultiSelect && inlineSpace}
          {showNumber && (
            <NumberInput
              value={formValue.number}
              onChange={handleFieldChange('number')}
              disabled={disabled}
              block={blockMode}
              placeholder="Enter a number"
            />
          )}
          {showNumber && inlineSpace}
          {showRange && (
            <Range
              value={formValue.range}
              onChange={handleFieldChange('range')}
              disabled={disabled}
              block={blockMode}
            />
          )}
          {showRange && inlineSpace}
          {showSelect && (
            <Select
              value={formValue.select}
              options={SELECT_OPTIONS}
              onChange={handleFieldChange('select')}
              disabled={disabled}
              block={blockMode}
              placeholder="Select value"
            />
          )}
          {showSelect && inlineSpace}
          {showText && (
            <Text
              value={formValue.text}
              onChange={handleFieldChange('text')}
              disabled={disabled}
              block={blockMode}
              placeholder="Text"
            />
          )}
          {showText && inlineSpace}
          {showTextarea && (
            <Textarea
              value={formValue.textarea}
              onChange={handleFieldChange('textarea')}
              disabled={disabled}
              block={blockMode}
              placeholder="Multiple lines of text"
            />
          )}
          {showTextarea && inlineSpace}
          {showTime && (
            <Time
              value={formValue.time}
              onChange={handleFieldChange('time')}
              disabled={disabled}
              block={blockMode}
            />
          )}
          {showTime && inlineSpace}
          {/* compound */}
          {showDatetime && (
            <Datetime
              value={formValue.datetime}
              onChange={handleFieldChange('datetime')}
              disabled={disabled}
              block={blockMode}
            />
          )}
          {showDatetime && inlineSpace}
          {showDatetimeRange && (
            <DatetimeRange
              value={formValue.datetimeRange}
              onChange={handleFieldChange('datetimeRange')}
              disabled={disabled}
              block={blockMode}
            />
          )}
          {showDatetimeRange && inlineSpace}
          {/* submit */}
          <Button
            type="submit"
            block={blockMode}
            disabled={disabled}
          >
            Submit Results
          </Button>
        </form>
      </ResizeContainer>
    </div>
  )
}

const container = document.querySelector('div.demo-mount-stress-test')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<StressTest />)
}
