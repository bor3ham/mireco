import casual from 'casual-browserify'
import { addDays, subDays } from 'date-fns'
import { dateValueAsDate, dateAsDateValue, dateAsMonth } from 'mireco'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * 60 * 60 * 1000
const STEP_MS = 15 * 60 * 1000

export const getRandomText = () => {
  return casual.title
}

export const getRandomTextarea = () => {
  return casual.description
}

export const getRandomDate = () => (
  dateAsDateValue(addDays(subDays(new Date(), 30), casual.integer(0, 60)))
)

export const getRandomDateRange = () => {
  const a = getRandomDate()
  const b = getRandomDate()
  const parsedA = dateValueAsDate(a)
  const parsedB = dateValueAsDate(a)
  if (parsedA > parsedB) {
    return {
      start: b,
      end: a,
    }
  }
  return {
    start: a,
    end: b,
  }
}

export const getRandomCalendarMonth = () => (
  casual.integer(0, 11)
)

export const getRandomMonth = () => (dateAsMonth(new Date(
  (new Date().getFullYear()) + casual.integer(-2, 2),
  getRandomCalendarMonth(),
)))

export const getRandomCheckbox = () => (!!casual.coin_flip)

export const getRandomDatetime = () => (
  casual.random_element([
    Math.round((+(new Date()) + casual.integer(-30 * DAY_MS, 30 * DAY_MS)) / STEP_MS) * STEP_MS, // rounded step
    +(new Date()) + casual.integer(-30 * DAY_MS, 30 * DAY_MS), // random uneven time
  ])
)

export const getRandomDuration = () => (
  casual.random_element([
    casual.integer(0, 48) * HOUR_MS,
    casual.integer(0, 12 * 60) * MINUTE_MS,
  ])
)

export const getRandomNumber = () => (
  casual.integer(0, 100)
)

export const getRandomTime = () => (
  casual.random_element([
    Math.round(casual.integer(0, 24 * HOUR_MS) / STEP_MS) * STEP_MS, // rounded step
    casual.integer(0, 24 * HOUR_MS), // random uneven time
  ])
)

export const getRandomDatetimeRange = () => {
  const a = getRandomDatetime()
  const b = getRandomDatetime()
  const parsedA = new Date(a)
  const parsedB = new Date(b)
  if (parsedA > parsedB) {
    return {
      start: b,
      end: a,
    }
  }
  return {
    start: a,
    end: b,
  }
}
