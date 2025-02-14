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
  Select,
  type SelectInputValue,
  MultiSelect,
  type SelectValue,
  type SelectOption,
  type SelectOptionInputValue,
  AsyncSelect,
} from 'mireco'
import casual from 'casual-browserify'

import {
  getRandomMonth,
  getRandomCalendarMonth,
  getRandomText,
  getRandomTextarea,
  getRandomCheckbox,
  getRandomDate,
  getRandomDateRange,
  getRandomDatetime,
  getRandomDatetimeRange,
  getRandomDuration,
  getRandomNumber,
  getRandomTime,
} from '../random'

const DARK_STYLE = `
form.lab-controls {
	--MIRECO-popover-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
	--MIRECO-focus-shadow: 0 0 0 0.15rem transparent, 0 0 0 0.15rem rgba(0, 123, 255, 0.2);
	--MIRECO-drawer-background: #222;
	--MIRECO-drawer-background-interact: rgb(49.3, 49.3, 49.3);
	--MIRECO-drawer-text: #fff;
	--MIRECO-content-background: #111;
	--MIRECO-content-background-interact: rgb(32.3, 32.3, 32.3);
	--MIRECO-content-edge: #595c6a;
	--MIRECO-content-text: #fff;
	--MIRECO-content-text-soft: rgb(124.7367616089, 124.7367616089, 124.7367616089);
	--MIRECO-content-text-faint: rgb(78.1139683693, 78.1139683693, 78.1139683693);
	--MIRECO-content-primary: rgb(25.5, 136.2, 255);
	--MIRECO-content-secondary: rgb(25.8333333333, 181.9565217391, 206.6666666667);
	--MIRECO-primary-background: #007bff;
	--MIRECO-primary-background-interact: rgb(15.3, 130.92, 255);
	--MIRECO-primary-text: #fff;
	--MIRECO-primary-contained-background: rgb(23.4102229285, 89.708933106, 175.6110544274);
	--MIRECO-primary-contained-background-interact: rgb(25.2099119646, 96.6054152046, 189.1113653913);
	--MIRECO-primary-contained-text: #fff;
	--MIRECO-secondary-background: #17a2b8;
	--MIRECO-secondary-background-interact: rgb(24.7, 173.9739130435, 197.6);
	--MIRECO-secondary-text: #fff;
	--MIRECO-form-field-background: #000;
	--MIRECO-form-field-background-disabled: rgb(38.25, 38.25, 38.25);
	--MIRECO-form-field-edge: var(--MIRECO-content-edge);
	--MIRECO-form-field-edge-rounding: var(--MIRECO-edge-rounding);
	--MIRECO-form-field-text: var(--MIRECO-content-text);
	--MIRECO-form-field-placeholder: var(--MIRECO-content-text-soft);
}
`

const SELECT_OPTIONS = [
  {
    value: 'bike',
    label: 'Bicycle',
  },
  {
    value: 'cyclone',
    label: 'Cyclone',
  },
  {
    value: 'wash_cycle',
    label: 'Wash Cycle',
  },
  {
    value: 'binoculars',
    label: 'Binoculars',
  },
]

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
  select: SelectInputValue
  multiSelect: SelectValue[]
  asyncSelect: SelectOptionInputValue
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
  datetimeRange: {
    start: null,
    end: null,
  },
  select: null,
  multiSelect: [],
  asyncSelect: null,
}

const shuffledArray = (source: any[]) => {
  const shuffled = [...source]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
}

const SIMULATED_LAG = 1000

const fakeResults = (searchTerm: string): SelectOption[] => {
  const keyedTerm = searchTerm.toLowerCase().trim().replace(' ', '_')
  return [
    {
      value: `${keyedTerm}`,
      label: `Basic ${searchTerm}`,
    },
    {
      value: `new_${keyedTerm}`,
      label: `New ${searchTerm}`,
    },
    {
      value: 'other_item',
      label: 'Other Item',
    },
  ]
}

const fakeLoadResults = (searchTerm: string): Promise<SelectOption[]> => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve(fakeResults(searchTerm))
    }, SIMULATED_LAG)
  })
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
  month: casual.coin_flip ? getRandomMonth() : null,
  calendarMonth: casual.coin_flip ? getRandomCalendarMonth() : null,
  datetime: casual.coin_flip ? getRandomDatetime() : null,
  dateRange: casual.random_element([
    {
      start: null,
      end: null,
    },
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
  datetimeRange: casual.random_element([
    {
      start: null,
      end: null,
    },
    {
      start: getRandomDatetime(),
      end: null,
    },
    {
      start: null,
      end: getRandomDatetime(),
    },
    getRandomDatetimeRange(),
  ]),
  select: casual.coin_flip ? casual.random_element(SELECT_OPTIONS).value : null,
  multiSelect: shuffledArray(SELECT_OPTIONS).slice(0, casual.integer(0, SELECT_OPTIONS.length)).map((option) => (option.value)),
  asyncSelect: casual.coin_flip ? casual.random_element(
    fakeResults(casual.word),
  ) : null,
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
  month: getRandomMonth(),
  calendarMonth: getRandomCalendarMonth(),
  datetime: getRandomDatetime(),
  dateRange: getRandomDateRange(),
  datetimeRange: getRandomDatetimeRange(),
  select: casual.random_element(SELECT_OPTIONS).value,
  multiSelect: shuffledArray(SELECT_OPTIONS).slice(0, casual.integer(1, SELECT_OPTIONS.length)).map((option) => (option.value)),
  asyncSelect: casual.random_element(
    fakeResults(casual.word),
  ),
})

export const FullFormExample = () => {
  const [disabled, setDisabled] = useState(false)
  const handleDisabledChange = useCallback((newValue: boolean) => {
    setDisabled(newValue)
  }, [])
  const [block, setBlock] = useState(true)
  const handleBlockChange = useCallback((newValue: boolean) => {
    setBlock(newValue)
  }, [])
  const [dark, setDark] = useState(false)
  const handleDarkChange = useCallback((newValue: boolean) => {
    setDark(newValue)
  }, [])
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
  const handleSelectChange = useCallback((newValue: SelectInputValue) => {
    setValueField('select', newValue)
  }, [setValueField])
  const handleMultiSelectChange = useCallback((newValue: SelectValue[]) => {
    setValueField('multiSelect', newValue)
  }, [setValueField])
  const handleAsyncChange = useCallback((newValue: SelectValue[]) => {
    setValueField('asyncSelect', newValue)
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
    <>
      <Checkbox value={block} onChange={handleBlockChange}>Block</Checkbox>
      {' '}
      <Checkbox value={disabled} onChange={handleDisabledChange}>Disabled</Checkbox>
      {' '}
      <Checkbox value={dark} onChange={handleDarkChange}>Dark Mode</Checkbox>
      <form className="lab-controls" onSubmit={handleFormSubmit} style={{
        background: dark ? '#111' : '#fff',
      }}>
        {dark && (
          <style>{DARK_STYLE}</style>
        )}
        <Text
          block={block}
          disabled={disabled}
          value={value.text}
          onChange={handleTextChange}
          placeholder="Text"
        />
        <Textarea
          block={block}
          disabled={disabled}
          value={value.textarea}
          onChange={handleTextareaChange}
          placeholder="Textarea"
        />
        <Checkbox
          block={block}
          disabled={disabled}
          value={value.checkbox}
          onChange={handleCheckboxChange}
        >
          Checkbox
        </Checkbox>
        <Number
          block={block}
          disabled={disabled}
          value={value.number}
          onChange={handleNumberChange}
          placeholder="Number"
        />
        <Range
          block={block}
          disabled={disabled}
          value={value.range}
          onChange={handleRangeChange}
        />
        <Time
          block={block}
          disabled={disabled}
          value={value.time}
          onChange={handleTimeChange}
          placeholder="Time"
        />
        <Duration
          block={block}
          disabled={disabled}
          value={value.duration}
          onChange={handleDurationChange}
          placeholder="Duration"
        />
        <Date
          block={block}
          disabled={disabled}
          value={value.date}
          onChange={handleDateChange}
          placeholder="Date"
        />
        <Month
          block={block}
          disabled={disabled}
          value={value.month}
          onChange={handleMonthChange}
          placeholder="Month"
        />
        <CalendarMonth
          block={block}
          disabled={disabled}
          value={value.calendarMonth}
          onChange={handleCalendarMonthChange}
          placeholder="Calendar Month"
        />
        <Datetime
          block={block}
          disabled={disabled}
          value={value.datetime}
          onChange={handleDatetimeChange}
          datePlaceholder="Date"
          timePlaceholder="Time"
        />
        <DateRange
          block={block}
          disabled={disabled}
          value={value.dateRange}
          onChange={handleDateRangeChange}
          startPlaceholder="Start"
          endPlaceholder="End"
        />
        <DatetimeRange
          block={block}
          disabled={disabled}
          value={value.datetimeRange}
          onChange={handleDatetimeRangeChange}
          startDatePlaceholder="Date"
          startTimePlaceholder="Time"
          endDatePlaceholder="Date"
          endTimePlaceholder="Time"
        />
        <Select
          block={block}
          disabled={disabled}
          value={value.select}
          options={SELECT_OPTIONS}
          onChange={handleSelectChange}
        />
        <MultiSelect
          block={block}
          disabled={disabled}
          value={value.multiSelect}
          options={SELECT_OPTIONS}
          onChange={handleMultiSelectChange}
          placeholder="Multi Select"
        />
        <AsyncSelect
          block={block}
          disabled={disabled}
          value={value.asyncSelect}
          getOptions={fakeLoadResults}
          onChange={handleAsyncChange}
          placeholder="Async Select"
        />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <div>
            <Button type="button" className="secondary" onClick={reset} disabled={disabled}>Reset</Button>
            {' '}
            <Button type="button" className="secondary" onClick={randomise} disabled={disabled}>Randomise</Button>
            {' '}
            <Button type="button" className="secondary" onClick={fill} disabled={disabled}>Fill</Button>
          </div>
          <Button type="submit" disabled={disabled}>Submit</Button>
        </div>
      </form>
    </>
  )
}
