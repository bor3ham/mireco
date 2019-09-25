import React from 'react'
import ReactDOM from 'react-dom'
import { Textarea } from 'mireco'

class DemoTextarea extends React.Component {
  state = {
    value: 'Example text value...\nWith multiple lines.',
  }
  render() {
    return (
      <div>
        <p>Field value: {JSON.stringify(this.state.value)}</p>
        <Textarea
          block
          placeholder="Textarea value"
          value={this.state.value}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-textarea')
if (mount.length) {
  ReactDOM.render(<DemoTextarea />, mount[0])
}
