import { isValid, parse } from 'date-fns'

import { ISO_8601_DATE_FORMAT } from 'utilities'

function isIso8601Date(string) {
  return isValid(parse(string, ISO_8601_DATE_FORMAT, new Date()))
}

const requiredDayPropType = (props, propName, componentName) => {
  const value = props[propName]

  if (value === null || typeof value === 'undefined') {
    return new TypeError(
      `Missing required ISO 8601 date prop: ${value} for ${propName} in ${componentName}`
    )
  }

  if (typeof value !== 'string') {
    return new TypeError(
      `Invalid type for ISO 8601 date: ${value} for ${propName} in ${componentName}`
    )
  }

  if (!isIso8601Date(value)) {
    return new TypeError(
      `Invalid value of ISO 8601 date: ${value} for ${propName} in ${componentName}`
    )
  }

  return null
}

const dayPropType = (props, propName, componentName) => {
  if (props[propName] == null || typeof props[propName] === 'undefined') {
    return null
  }
  return requiredDayPropType(props, propName, componentName)
}
dayPropType.isRequired = requiredDayPropType

export default dayPropType
