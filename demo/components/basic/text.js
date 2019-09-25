import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoText extends React.Component {
  state = {
    value: 'Example text value',
  }
  render() {
    return (
      <div>
        <p>Field value: {JSON.stringify(this.state.value)}</p>
        <Mireco.Text
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
