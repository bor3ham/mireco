import React from 'react'
import ReactDOM from 'react-dom'
import Mireco from 'mireco'

class DemoText extends React.Component {
  state = {
    text: 'Example text value',
  }
  render() {
    return (
      <div>
        Field value: {JSON.stringify(this.state.text)}
        <Mireco.block.Text
          placeholder="Text value"
          value={this.state.text}
          onChange={(newValue) => {
            this.setState({text: newValue})
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
