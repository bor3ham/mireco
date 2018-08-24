import React from 'react'

import InlineCheckbox from '../checkbox.js'

class Checkbox extends React.Component {
  render() {
    return (
      <InlineCheckbox
        {...this.props}
        block={true}
      />
    )
  }
}

export default Checkbox
