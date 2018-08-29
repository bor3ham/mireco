import React from 'react'

import InlineDatetime from '../datetime.js'

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
