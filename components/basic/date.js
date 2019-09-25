import React from 'react'
import ReactDOM from 'react-dom'
import { Date as DateInput } from 'mireco'

class DemoDate extends React.Component {
  state = {
    value: null,
  }
  render() {
    return (
      <div>
        <p>Field value: {JSON.stringify(this.state.value) || 'undefined'}</p>
        <DateInput
          block
          placeholder="Date value"
          value={this.state.value}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-date')
if (mount.length) {
  ReactDOM.render(<DemoDate />, mount[0])
}
