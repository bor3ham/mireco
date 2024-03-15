import React, { useCallback } from 'react'

export const useInputKeyDownHandler = (
  controlsOpen: boolean,
  closeControls?: () => void,
  cleanText?: () => void,
  recordFocus?: () => void,
  upAdjust?: () => void,
  downAdjust?: () => void,
) => useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter' || event.key === 'Escape') {
    if (controlsOpen) {
      if (cleanText) cleanText()
      if (closeControls) closeControls()
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
  cleanText,
  recordFocus,
  upAdjust,
  downAdjust,
])
