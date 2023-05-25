import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Button } from 'mireco'

const DemoButtonStyles = () => (
  <>
    <p>Standard:</p>
    <p>
      <Button>Primary</Button>
      {' '}
      <Button className="secondary">Secondary</Button>
      {' '}
      <Button className="content">Content</Button>
      {' '}
      <Button disabled>Disabled</Button>
    </p>
    <p>Outlined:</p>
    <p>
      <Button className="outline">Primary</Button>
      {' '}
      <Button className="secondary outline">Secondary</Button>
      {' '}
      <Button className="content outline">Content</Button>
      {' '}
      <Button className="outline" disabled>Disabled</Button>
    </p>
    <p>Links with button classes:</p>
    <p>
      <a href="#" className="MIRECO-button">Primary</a>
      {' '}
      <a href="#" className="MIRECO-button secondary">Secondary</a>
      {' '}
      <a href="#" className="MIRECO-button content">Content</a>
      {' '}
      <a className="MIRECO-button disabled">Disabled</a>
    </p>
  </>
)

const container = document.querySelector('div.demo-mount-button-styles')
if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<DemoButtonStyles />)
}
