import React from 'react'

import InlineDate from '../date.js'

class Date extends React.Component {
  render() {
    return (
      <InlineDate
        {...this.props}
        block={true}
      />
    )
  }
}

export default Date
