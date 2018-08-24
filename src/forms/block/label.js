import React from 'react'

import InlineLabel from '../label.js'

class Label extends React.Component {
  render() {
    return (
      <InlineLabel
        {...this.props}
        block={true}
      />
    )
  }
}

export default Label
