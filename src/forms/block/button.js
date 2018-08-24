import React from 'react'

import InlineButton from '../button.js'

class Button extends React.Component {
  render() {
    return (
      <InlineButton
        {...this.props}
        block={true}
      />
    )
  }
}

export default Button
