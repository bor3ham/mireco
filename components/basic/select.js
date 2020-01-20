import React from 'react'
import ReactDOM from 'react-dom'
import { Select } from 'mireco'

const OPTIONS = [
  {
    value: 'bike',
    label: 'Bicycle',
  },
  {
    value: 'cyclone',
    label: 'Cyclone',
  },
  {
    value: 'wash_cycle',
    label: 'Wash Cycle',
  },
  {
    value: 'binoculars',
    label: 'Binoculars',
  },
]

class DemoText extends React.PureComponent {
  state = {
    value: null,
  }
  render() {
    return (
      <div>
        <p>Field value: {JSON.stringify(this.state.value) || 'undefined'}</p>
        <Select
          block
          placeholder="Select value"
          value={this.state.value}
          options={OPTIONS}
          onChange={(newValue) => {
            this.setState({value: newValue})
          }}
        />
      </div>
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-select')
if (mount.length) {
  ReactDOM.render(<DemoText />, mount[0])
}
