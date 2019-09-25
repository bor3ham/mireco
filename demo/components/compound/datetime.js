import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoDatetime extends React.Component {
  state = {
    value: null,
  }
  stringifiedValue = () => {
    if (typeof this.state.value === 'number') {
      return JSON.stringify(new Date(this.state.value))
    }
    if (typeof this.state.value === 'undefined') {
      return 'undefined'
    }
    return JSON.stringify(this.state.value)
  }
  render() {
    return (
      <div>
        <p>Field value: {this.stringifiedValue()}</p>
        <Mireco.Datetime
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

const mount = document.querySelectorAll('div.demo-mount-datetime')
if (mount.length) {
  ReactDOM.render(<DemoDatetime />, mount[0])
}
