import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Number as NumberInput } from 'mireco/inputs'

const STEP = 1
const MIN = 0
const MAX = 100

const DemoNumber = () => {
  const [value, setValue] = useState(5)
  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])
  const stringified = typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)
  return (
    <>
      <dl>
        <dt>Step</dt>
        <dd>{STEP}</dd>
        <dt>Min</dt>
        <dd>{MIN}</dd>
        <dt>Max</dt>
        <dd>{MAX}</dd>
      </dl>
      <p>Field value: {stringified}</p>
      <NumberInput
        block
        placeholder="Number value"
        value={value}
        onChange={handleChange}
        step={STEP}
        min={MIN}
        max={MAX}
      />
    </>
  )
}

const container = document.querySelector('div.demo-mount-number')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoNumber />)
}
