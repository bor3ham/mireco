import React from 'react'

import InlineTextarea from '../textarea.js'

class Textarea extends React.Component {
  render() {
    return (
      <InlineTextarea
        {...this.props}
        block={true}
      />
    )
  }
}

export default Textarea
