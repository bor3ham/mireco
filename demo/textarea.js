import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoTextarea extends React.Component {
  state = {
    text: 'Example text value...\nWith multiple lines.',
  }
  render() {
    return (
      <div>
        Field value: {JSON.stringify(this.state.text)}
        <Mireco.Textarea
          block
          placeholder="Textarea value"
          value={this.state.text}
          onChange={(newValue) => {
            this.setState({text: newValue})
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
