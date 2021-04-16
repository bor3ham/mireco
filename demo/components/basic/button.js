import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'mireco/inputs'

function DemoButton(props) {
  const [numPresses, setNumPresses] = useState(0)
  const handleClick = () => {
    setNumPresses(numPresses + 1)
  }
  return (
    <>
      <p>Button pressed: {numPresses} time{numPresses === 1 ? '' : 's'}</p>
      <Button onClick={handleClick}>Press Me</Button>
    </>
  )
}

const mount = document.querySelector('div.demo-mount-button')
if (mount) {
  ReactDOM.render(<DemoButton />, mount)
}
