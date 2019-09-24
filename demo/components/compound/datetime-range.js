import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoDatetimeRange extends React.Component {
  state = {
    value: null,
  }
  stringifiedDate = (date) => {
    if (typeof date === 'number') {
      return JSON.stringify(new Date(date))
    }
    if (typeof date === 'undefined') {
      return 'undefined'
    }
    return JSON.stringify(date)
  }
  stringifiedValue = () => {
    if (this.state.value) {
      return JSON.stringify({
        start: this.stringifiedDate(this.state.value.start),
        end: this.stringifiedDate(this.state.value.end),
      })
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
        <Mireco.DatetimeRange
          value={this.state.value}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}
const mount = document.querySelectorAll('div.demo-mount-datetime-range')
if (mount.length) {
  ReactDOM.render(<DemoDatetimeRange />, mount[0])
}
