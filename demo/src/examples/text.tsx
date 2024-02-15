import React, { useState, useCallback } from 'react'
import { Text } from 'mireco'

export const TextExample = () => {
  const [value, setValue] = useState<string>('')
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  return (
    <>
      <p><code>Current value: {JSON.stringify(value)}</code></p>
      <Text
        value={value}
        onChange={handleChange}
        placeholder="Enter text"
      />
    </>
  )
}
