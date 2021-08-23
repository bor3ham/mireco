import { isValid, parse } from 'date-fns'

import * as constants from '../constants.js'

function isIso8601Date(string) {
  return isValid(parse(string, constants.ISO_8601_DATE_FORMAT, new Date()))
}

const requiredDatePropType = (props, propName, componentName) => {
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

const datePropType = (props, propName, componentName) => {
  if (props[propName] == null || typeof props[propName] === 'undefined') {
    return null
  }
  return requiredDatePropType(props, propName, componentName)
}
datePropType.isRequired = requiredDatePropType

export { datePropType }
