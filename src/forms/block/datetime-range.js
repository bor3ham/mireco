import React from 'react'

import InlineDatetimeRange from '../datetime-range.js'

class DatetimeRange extends React.Component {
  render() {
    return (
      <InlineDatetimeRange
        {...this.props}
        block={true}
      />
    )
  }
}

export default DatetimeRange
