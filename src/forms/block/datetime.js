import React from 'react'

import InlineDatetime from '../date.js'

class Datetime extends React.Component {
  render() {
    return (
      <InlineDatetime
        {...this.props}
        block={true}
      />
    )
  }
}

export default Datetime
