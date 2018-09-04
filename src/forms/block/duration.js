import React from 'react'

import InlineDuration from '../duration.js'

class Duration extends React.Component {
  render() {
    return (
      <InlineDuration
        {...this.props}
        block={true}
      />
    )
  }
}

export default Duration
