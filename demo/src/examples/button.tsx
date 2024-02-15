import React, { useState, useCallback } from 'react'
import { Button } from 'mireco'

export const ButtonExample = () => {
  const [numPresses, setNumPresses] = useState(0)
  const handleClick = useCallback(() => {
    setNumPresses((prev) => (prev + 1))
  }, [])
  return (
    <>
      <p><code>Button pressed: {numPresses} time{numPresses === 1 ? '' : 's'}</code></p>
      <Button onClick={handleClick}>Press Me</Button>
    </>
  )
}
