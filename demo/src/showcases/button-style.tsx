import React from 'react'
import { Button } from 'mireco'

export const ButtonStyleShowcase = () => (
  <>
    <p>Standard:</p>
    <p>
      <Button>Primary</Button>
      {' '}
      <Button className="MIRECO-secondary">Secondary</Button>
      {' '}
      <Button className="MIRECO-content">Content</Button>
      {' '}
      <Button disabled>Disabled</Button>
    </p>
    <p>Outlined:</p>
    <p>
      <Button className="MIRECO-outline">Primary</Button>
      {' '}
      <Button className="MIRECO-secondary MIRECO-outline">Secondary</Button>
      {' '}
      <Button className="MIRECO-content MIRECO-outline">Content</Button>
      {' '}
      <Button className="MIRECO-outline" disabled>Disabled</Button>
    </p>
    <p>Links with button classes:</p>
    <p>
      <a href="#" className="MIRECO-button">Primary</a>
      {' '}
      <a href="#" className="MIRECO-button MIRECO-secondary">Secondary</a>
      {' '}
      <a href="#" className="MIRECO-button MIRECO-content">Content</a>
      {' '}
      <a className="MIRECO-button disabled">Disabled</a>
    </p>
  </>
)
