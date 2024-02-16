import React, { type ReactElement } from 'react'
import * as ReactDOM from 'react-dom/client'
import { init } from 'uptick-demo-site'

import {
  DateExample,
  ButtonExample,
  TextExample,
  TextareaExample,
  CheckboxExample,
  NumberExample,
  RangeExample,
  TimeExample,
  DurationExample,
  MonthExample,
  CalendarMonthExample,
  DatetimeExample,
  DateRangeExample,
  DatetimeRangeExample,
  SelectExample,
  MultiSelectExample,
  AsyncSelectExample,
} from './examples'
import { ButtonStyleShowcase } from './showcases'
import {
  TextSandbox,
} from './sandboxes'

const MOUNTS: Record<string, ReactElement> = {
  'div.date-example': <DateExample />,
  'div.button-example': <ButtonExample />,
  'div.button-style-showcase': <ButtonStyleShowcase />,
  'div.text-example': <TextExample />,
  'div.textarea-example': <TextareaExample />,
  'div.checkbox-example': <CheckboxExample />,
  'div.number-example': <NumberExample />,
  'div.range-example': <RangeExample />,
  'div.time-example': <TimeExample />,
  'div.duration-example': <DurationExample />,
  'div.month-example': <MonthExample />,
  'div.calendar-month-example': <CalendarMonthExample />,
  'div.datetime-example': <DatetimeExample />,
  'div.date-range-example': <DateRangeExample />,
  'div.datetime-range-example': <DatetimeRangeExample />,
  'div.select-example': <SelectExample />,
  'div.multi-select-example': <MultiSelectExample />,
  'div.async-select-example': <AsyncSelectExample />,
  'div.text-sandbox': <TextSandbox />,
}

Object.keys(MOUNTS).forEach((mount) => {
  const container = document.querySelector(mount)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(MOUNTS[mount])
  }
})

init()
