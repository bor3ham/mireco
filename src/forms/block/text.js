import React from 'react'

import InlineText from '../text.js'

class Text extends React.Component {
  render() {
    return (
      <InlineText
        {...this.props}
        block={true}
      />
    )
  }
}

export default Text
