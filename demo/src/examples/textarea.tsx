import React, { useState, useCallback } from 'react'
import { Textarea } from 'mireco'

export const TextareaExample = () => {
  const [value, setValue] = useState<string>('')
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {JSON.stringify(value)}</code></p>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Enter multiple lines of text"
      />
    </>
  )
}
