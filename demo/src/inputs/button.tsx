import React, { useState, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Button } from 'mireco'

const DemoButton = () => {
  const [numPresses, setNumPresses] = useState(0)
  const handleClick = useCallback(() => {
    setNumPresses((prev) => (prev + 1))
  }, [])
  return (
    <>
      <p>Button pressed: {numPresses} time{numPresses === 1 ? '' : 's'}</p>
      <Button onClick={handleClick}>Press Me</Button>
    </>
  )
}

const container = document.querySelector('div.demo-mount-button')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoButton />)
}
