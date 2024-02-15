import React, { useState, useCallback } from 'react'
import { Checkbox } from 'mireco'

export const CheckboxExample = () => {
  const [value, setValue] = useState<boolean>(false)
  const handleChange = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Checked: {value ? 'Yes' : 'No'}</code></p>
      <Checkbox value={value} onChange={handleChange}>
        Click to toggle
      </Checkbox>
    </>
  )
}
