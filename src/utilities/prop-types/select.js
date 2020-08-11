import PropTypes from 'prop-types'

export const selectValue = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
])

export const selectOption = PropTypes.shape({
  value: selectValue.isRequired,
  label: PropTypes.string,
})
