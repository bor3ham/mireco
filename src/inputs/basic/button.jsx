import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onMouseMove={props.onMouseMove}
      onMouseOut={props.onMouseOut}
      onMouseOver={props.onMouseOver}
      onMouseUp={props.onMouseUp}
      type={props.type}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}

      className={classNames(
        'MIRECO-button',
        {
          block: props.block,
        },
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </button>
  )
}
Button.propTypes = {
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseUp: PropTypes.func,

  type: PropTypes.oneOf(['button', 'submit']),
  name: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  tabIndex: PropTypes.number,

  children: PropTypes.node,
  block: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
}
Button.defaultProps = {
  type: 'button',
  tabIndex: 0,
  disabled: false,
}

export default Button
