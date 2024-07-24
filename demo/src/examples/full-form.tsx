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
  const block = true
  return (
    <form className="lab-controls" onSubmit={handleFormSubmit}>
      <Text
        block={block}
        value={value.text}
        onChange={handleTextChange}
        placeholder="Text"
      />
      <Textarea
        block={block}
        value={value.textarea}
        onChange={handleTextareaChange}
        placeholder="Textarea"
      />
      <Checkbox
        block={block}
        value={value.checkbox}
        onChange={handleCheckboxChange}
      >
        Checkbox
      </Checkbox>
      <Number
        block={block}
        value={value.number}
        onChange={handleNumberChange}
        placeholder="Number"
      />
      <Range
        block={block}
        value={value.range}
        onChange={handleRangeChange}
      />
      <Time
        block={block}
        value={value.time}
        onChange={handleTimeChange}
        placeholder="Time"
      />
      <Duration
        block={block}
        value={value.duration}
        onChange={handleDurationChange}
        placeholder="Duration"
      />
      <Date
        block={block}
        value={value.date}
        onChange={handleDateChange}
        placeholder="Date"
      />
      <Month
        block={block}
        value={value.month}
        onChange={handleMonthChange}
        placeholder="Month"
      />
      <CalendarMonth
        block={block}
        value={value.calendarMonth}
        onChange={handleCalendarMonthChange}
        placeholder="Calendar Month"
      />
      <Datetime
        block={block}
        value={value.datetime}
        onChange={handleDatetimeChange}
        datePlaceholder="Date"
        timePlaceholder="Time"
      />
      <DateRange
        block={block}
        value={value.dateRange}
        onChange={handleDateRangeChange}
        startPlaceholder="Start"
        endPlaceholder="End"
      />
      <DatetimeRange
        block={block}
        value={value.datetimeRange}
        onChange={handleDatetimeRangeChange}
        startDatePlaceholder="Date"
        startTimePlaceholder="Time"
        endDatePlaceholder="Date"
        endTimePlaceholder="Time"
      />
      <Select
        block={block}
        value={value.select}
        options={SELECT_OPTIONS}
        onChange={handleSelectChange}
      />
      <MultiSelect
        block={block}
        value={value.multiSelect}
        options={SELECT_OPTIONS}
        onChange={handleMultiSelectChange}
        placeholder="Multi Select"
      />
      <AsyncSelect
        block={block}
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
