import React, { useCallback, useEffect, useState } from 'react'

export const useInputKeyDownHandler = (
  controlsOpen: boolean,
  closeControls?: () => void,
  submit?: () => void,
  recordFocus?: () => void,
  upAdjust?: () => void,
  downAdjust?: () => void,
  openShortcuts?: () => void,
) => useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === '!' && openShortcuts) {
    openShortcuts()
    event.preventDefault()
    return
  }
  if (event.key === 'Escape') {
    if (controlsOpen) {
      if (closeControls) closeControls()
      event.preventDefault()
    }
    return
  }
  if (event.key === 'Enter') {
    if (controlsOpen) {
      if (submit) submit()
      event.preventDefault()
    }
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (upAdjust) upAdjust()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (downAdjust) downAdjust()
  }
  if (recordFocus) recordFocus()
}, [
  controlsOpen,
  closeControls,
  submit,
  recordFocus,
  upAdjust,
  downAdjust,
  openShortcuts,
])

type FocusHandler = () => void

export function useLabelHover(id: string | undefined, focus?: FocusHandler) {
  const [labelHovered, setLabelHovered] = useState(false)
  const handleMouseOver = useCallback((event: MouseEvent) => {
    if (id && event.target) {
      const domTarget = event.target as HTMLElement
      if (domTarget && domTarget.matches(`label[for="${id}"]`)) {
        setLabelHovered(true)
      }
    }
  }, [id])
  const handleMouseOut = useCallback((event: MouseEvent) => {
    if (id && event.target) {
      const domTarget = event.target as HTMLElement
      if (domTarget && domTarget.matches(`label[for="${id}"]`)) {
        setLabelHovered(false)
      }
    }
  }, [id])
  const handleClick = useCallback((event: MouseEvent) => {
    if (id && event.target && focus) {
      const domTarget = event.target as HTMLElement
      if (domTarget && domTarget.matches(`label[for="${id}"]`)) {
        focus()
      }
    }
  }, [id])
  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('click', handleClick)
    }
  }, [handleMouseOver, handleMouseOut])
  return labelHovered
}
