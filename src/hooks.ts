import React, { useCallback } from 'react'

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
