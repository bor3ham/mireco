import React from 'react'

import InlineTime from '../time.js'

class Time extends React.Component {
  render() {
    return (
      <InlineTime
        {...this.props}
        block={true}
      />
    )
  }
}

export default Time
