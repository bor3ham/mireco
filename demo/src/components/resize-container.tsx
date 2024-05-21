import React, { useRef, useState, useCallback, useEffect } from 'react'
// import Cookies from 'js-cookie'

interface ResizeContainerProps {
  children: React.ReactNode
}

export const ResizeContainer: React.FC<ResizeContainerProps> = ({
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<number | null>(null) // Cookies.get('container-size')
  const [resizing, setResizing] = useState(false)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (resizing && containerRef.current) {
      const size = event.clientX - containerRef.current.getBoundingClientRect().x
      setSize(size)
      // Cookies.set('container-size', size)
    }
  }, [resizing])
  const handleEdgeClick = useCallback(() => {
    setResizing(true)
  }, [])
  const handleRelease = useCallback(() => {
    setResizing(false)
  }, [])
  const handleEdgeDoubleClick = useCallback(() => {
    setSize(null)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleRelease)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleRelease)
    }
  }, [
    handleMouseMove,
    handleRelease,
  ])
  
  return (
    <div
      ref={containerRef}
      className="resize-container"
      style={{
        display: 'flex',
      }}
    >
      <div className="contents" style={{
        flex: size === null ? '1' : '0',
        flexBasis: size === null ? 'auto' : `${size}px`,
        maxWidth: size === null ? 'auto' : `${size}px`,
        padding: '2rem 0',
      }}>
        {children}
      </div>
      <div
        className="handle"
        style={{
          flexShrink: '0',
          width: '5px',
          background: '#999',
          cursor: 'ew-resize',
        }}
        onMouseDown={handleEdgeClick}
        onDoubleClick={handleEdgeDoubleClick}
      />
    </div>
  )
}
