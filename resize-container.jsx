import React from 'react'
import Cookies from 'js-cookie'

class ResizeContainer extends React.PureComponent {
  constructor(props) {
    super(props)

    this.containerRef = React.createRef()

    this.state = {
      ...this.state,
      resizing: false,
      size: Cookies.get('container-size') || null,
    }
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleRelease)
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleRelease)
  }
  handleMouseMove = (event) => {
    if (this.state.resizing && this.containerRef.current) {
      const size = event.clientX - this.containerRef.current.getBoundingClientRect().x
      this.setState({size: size})
      Cookies.set('container-size', size)
    }
  }
  handleEdgeClick = () => {
    this.setState({resizing: true})
  }
  handleRelease = () => {
    this.setState({resizing: false})
  }
  handleEdgeDoubleClick = () => {
    this.setState({size: null})
  }
  render() {
    const contentsStyle = {}
    if (this.state.size) {
      contentsStyle.width = this.state.size
    }
    else {
      contentsStyle.flex = '1'
    }
    return (
      <div
        ref={this.containerRef}
        className="resize-container"
        style={{
          display: 'flex',
        }}
      >
        <div className="contents" style={contentsStyle}>
          {this.props.children}
        </div>
        <div
          className="handle"
          style={{
            width: '5px',
            background: '#999',
            cursor: 'ew-resize',
          }}
          onMouseDown={this.handleEdgeClick}
          onDoubleClick={this.handleEdgeDoubleClick}
        />
      </div>
    )
  }
}

export default ResizeContainer
