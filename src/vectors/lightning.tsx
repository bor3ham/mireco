import React from 'react'

interface LightningVectorProps {
  size?: number
}

export const LightningVector: React.FC<LightningVectorProps> = ({
  size = 24,
}) => (
  <svg
    className="MIRECO-lightning"
    version="1.1"
    viewBox="0 0 6.3499998 6.3499998"
    height={size}
    width={size}
  >
    <g
      transform="translate(0,-290.65)"
      id="layer1"
    >
      <path
        style={{
          fill: '#333333',
          fillOpacity: 1,
          stroke: 'none',
          strokeWidth: 0.529167,
        }}
        d="m 2.5135417,291.70833 -0.79375,2.11667 1.2225832,0.26458 -0.4288332,2.11667 2.3812499,-3.175 H 3.3072917 l 0.7937499,-1.32292 z"
        id="path1"
      />
    </g>
  </svg>
)
