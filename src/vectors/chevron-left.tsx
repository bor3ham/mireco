import React from 'react'

interface Props {
  style?: React.CSSProperties
  size?: number
}

export const ChevronLeftVector = ({
  style,
  size = 24,
}: Props) => (
  <svg
    className="MIRECO-chevron-left"
    width={size}
    height={size}
    viewBox="0 0 6.35 6.35"
    style={style}
  >
    <g transform="translate(0,-290.65)">
      <path
        style={{
          fill: 'none',
          stroke: '#333',
          strokeWidth: '0.5291667',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: '4',
          strokeDasharray: 'none',
          strokeOpacity: '1',
        }}
        d="M 3.96875,292.2375 2.3812499,293.825 3.96875,295.4125"
      />
    </g>
  </svg>
)
