import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoTime extends React.Component {
  state = {
    value: null,
  }
  stringifyValue() {
    if (typeof this.state.value === 'undefined') {
      return 'undefined'
    }
    return JSON.stringify(this.state.value)
  }
  render() {
    return (
      <div>
        <p>Field value: {this.stringifyValue()}</p>
        <Mireco.Time
          block
          value={this.state.value}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-time')
if (mount.length) {
  ReactDOM.render(<DemoTime />, mount[0])
}
