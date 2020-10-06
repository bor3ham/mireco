import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function Button(props) {
  return (
    <button
      onClick={props.onClick}
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
