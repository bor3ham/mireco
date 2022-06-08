import React from 'react'

const SpinnerVector = (props) => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 0 6.3499998 6.3499998"
    className="MIRECO-spinner"
  >
    <g
      transform="translate(0,-290.65)"
    >
      <path
        d="m 3.175,295.94168 a 2.1166666,2.1166666 0 0 1 -1.9555449,-1.30665 2.1166666,2.1166666 0 0 1 0.4588356,-2.30673 2.1166666,2.1166666 0 0 1 2.3067225,-0.45883 2.1166666,2.1166666 0 0 1 1.3066533,1.95554"
        style={{
          fill: 'none',
          fillOpacity: 0.271255,
          stroke: props.colour,
          strokeWidth: 0.529167,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          strokeDashoffset: 5.39717,
          strokeOpacity: 1,
        }}
      />
    </g>
  </svg>
)
SpinnerVector.defaultProps = {
  colour: '#333333',
  size: 24,
}

export { SpinnerVector }
