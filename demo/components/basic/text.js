import React from 'react'
import ReactDOM from 'react-dom'
import { Text } from 'mireco'

class DemoText extends React.PureComponent {
  state = {
    value: 'Example text value',
  }
  render() {
    return (
      <div>
        <p>Field value: {JSON.stringify(this.state.value)}</p>
        <Text
          block
          placeholder="Text value"
          value={this.state.value}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-text')
if (mount.length) {
  ReactDOM.render(<DemoText />, mount[0])
}
