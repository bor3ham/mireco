import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

let BlockDiv = (props, ref) => {
  let style = {}
  if (!props.block) {
    style.display = props.inlineDisplay
  }
  style = {
    ...style,
    ...props.style,
  }
  const divProps = {
    ...props,
  }
  if ('block' in divProps) {
    delete divProps['block']
  }
  if ('inlineDisplay' in divProps) {
    delete divProps['inlineDisplay']
  }
  return (
    <div
      {...divProps}
      ref={ref}
      style={style}
      className={classNames(props.className, {
        block: props.block,
      })}
    >
      {props.children}
    </div>
  )
}
BlockDiv = React.forwardRef(BlockDiv)
BlockDiv.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  block: PropTypes.bool,
  className: PropTypes.string,
  inlineDisplay: PropTypes.string,
}
BlockDiv.defaultProps = {
  inlineDisplay: 'inline-block',
}

export default BlockDiv
