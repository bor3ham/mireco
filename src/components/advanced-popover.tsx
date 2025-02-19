import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react'
import classNames from 'classnames'

import { Button, Text } from 'inputs'
import Lightning from '../vectors/lightning.svg'
import { ControlsPopover } from './controls-popover'
import { Dropdown } from './dropdown'
import { useInputKeyDownHandler } from 'hooks'
import Chevron from '../vectors/chevron.svg'

export interface AdvancedPopoverRef {
  openShortcuts(): void
}

type AdvancedPopoverProps = {
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
  shortcuts?: {
    value: any
    label: string
  }[]
  onSelectShortcut?(newValue: any): void
  focusOnField(): void
}

export const AdvancedPopover = forwardRef<AdvancedPopoverRef, AdvancedPopoverProps>(({
  header,
  children,
  className,
  shortcuts,
  onSelectShortcut,
  focusOnField,
}, ref) => {
  const fallbackShortcuts = useMemo(() => {
    if (!shortcuts) return []
    return shortcuts
  }, [shortcuts])
  const hasShortcuts = fallbackShortcuts.length > 0
  const hasHeader = !!header || hasShortcuts
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const openShortcuts = useCallback(() => {
    if (!hasShortcuts) return
    setShortcutsOpen(true)
  }, [hasShortcuts])
  const closeShortcutsSuccess = useCallback(() => {
    setShortcutsOpen(false)
    setFilter('')
    setActiveShortcut(null)
  }, [])
  const closeShortcutsCancel = useCallback(() => {
    closeShortcutsSuccess()
    focusOnField()
  }, [closeShortcutsSuccess, focusOnField])
  const handleSelectShortcut = useCallback((newValue: any) => {
    if (onSelectShortcut) {
      onSelectShortcut(newValue)
      closeShortcutsSuccess()
    }
  }, [onSelectShortcut, closeShortcutsSuccess])

  useImperativeHandle(ref, () => ({
    openShortcuts,
  }), [
    openShortcuts,
  ])

  const [activeShortcut, setActiveShortcut] = useState(null)

  const getFilteredOptions = useCallback((search: string) => {
    const terms = search.split(' ').map((term: string) => (
      term.trim().toLowerCase()
    )).filter((term: string) => (
      (term.length > 0)
    ))
    return fallbackShortcuts.filter((option: any) => {
      if (terms.length === 0) {
        return true
      }
      const searchable = `${option.label}${option.value}`.toLowerCase()
      let match = false
      terms.forEach((term) => {
        if (searchable.indexOf(term) !== -1) {
          match = true
        }
      })
      return match
    })
  }, [
    fallbackShortcuts,
  ])
  const findMatchingValue = useCallback((stringValue: string) => {
    let valueMatch: any = null
    fallbackShortcuts.forEach((option) => {
      const optionValue = `${option.value}`.trim().toLowerCase()
      if (valueMatch === null && optionValue === stringValue) {
        valueMatch = option.value
      }
    })
    if (valueMatch !== null) {
      return valueMatch
    }
    let labelMatch: any = null
    fallbackShortcuts.forEach((option) => {
      const optionLabel = `${option.label}`.trim().toLowerCase()
      if (labelMatch === null && optionLabel === stringValue) {
        labelMatch = option.value
      }
    })
    if (labelMatch !== null) {
      return labelMatch
    }
    const filtered = stringValue ? getFilteredOptions(stringValue) : fallbackShortcuts
    const current = filtered.find(option => (option.value === activeShortcut))
    const firstFilteredValue = filtered.length > 0 ? filtered[0].value : undefined
    return current ? current.value : firstFilteredValue
  }, [
    fallbackShortcuts,
    activeShortcut,
    getFilteredOptions,
  ])
  const filteredShortcuts = useMemo(() => (
    filter ? getFilteredOptions(filter) : fallbackShortcuts
  ), [
    filter,
    getFilteredOptions,
    fallbackShortcuts,
  ])

  const handleFilterChange = useCallback((newValue: string, event: any) => {
    setFilter(newValue)
    const cleaned = newValue.trim().toLowerCase()
    if (cleaned.length <= 0) {
      setActiveShortcut(null)
    } else {
      const matching = findMatchingValue(cleaned)
      setActiveShortcut(matching)
    }
  }, [findMatchingValue])

  const useShortcut = useCallback(() => {
    if (activeShortcut && onSelectShortcut) {
      onSelectShortcut(activeShortcut)
      closeShortcutsSuccess()
    } else {
      closeShortcutsCancel()
    }
  }, [
    activeShortcut,
    closeShortcutsCancel,
    closeShortcutsSuccess,
  ])
  const currentIndex = useMemo(() => {
    let ci = -1
    filteredShortcuts.forEach((option, index) => {
      if (option.value === activeShortcut) {
        ci = index
      }
    })
    return ci
  }, [filteredShortcuts, activeShortcut])
  const decrement = useCallback(() => {
    if (filteredShortcuts.length) {
      let nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = filteredShortcuts.length - 1
      }
      if (filteredShortcuts[nextIndex]) {
        setActiveShortcut(filteredShortcuts[nextIndex].value)
      } else {
        setActiveShortcut(null)
      }
    }
  }, [filteredShortcuts, currentIndex])
  const increment = useCallback(() => {
    if (filteredShortcuts.length) {
      let nextIndex = currentIndex + 1
      if (nextIndex >= filteredShortcuts.length) {
        nextIndex = 0
      }
      if (filteredShortcuts[nextIndex]) {
        setActiveShortcut(filteredShortcuts[nextIndex].value)
      } else {
        setActiveShortcut(null)
      }
    }
  }, [filteredShortcuts, currentIndex])
  const handleTextKeyDown = useInputKeyDownHandler(
    shortcutsOpen,
    closeShortcutsCancel,
    useShortcut,
    () => {},
    decrement,
    increment,
  )

  return (
    <ControlsPopover className={classNames('MIRECO-advanced-popover', className)}>
      {hasHeader && (
        <div className={classNames('MIRECO-advanced-popover-header', {
          shortcuts: shortcutsOpen,
        })}>
          {shortcutsOpen && (
            <>
              <Button
                type="button"
                onClick={closeShortcutsCancel}
                className="MIRECO-content MIRECO-outline MIRECO-shortcuts"
                tabIndex={-1}
                title="Back"
              >
                <Chevron className="MIRECO-chevron MIRECO-left" />
              </Button>
              <Text
                value={filter}
                onChange={handleFilterChange}
                placeholder="Search shortcuts"
                block
                autoFocus
                onKeyDown={handleTextKeyDown}
              />
            </>
          )}
          {!shortcutsOpen && (
            <>
              {hasShortcuts && (
                <Button
                  type="button"
                  className="MIRECO-content MIRECO-outline MIRECO-shortcuts"
                  onClick={openShortcuts}
                  title="Shortcuts (!)"
                  tabIndex={-1}
                >
                  <Lightning className="MIRECO-lightning" />
                </Button>
              )}
              {header}
            </>
          )}
        </div>
      )}
      <div className="MIRECO-advanced-popover-body">
        {shortcutsOpen && (
          <Dropdown
            options={filteredShortcuts}
            value={activeShortcut}
            embedded
            onSelect={handleSelectShortcut}
          />
        )}
        {!shortcutsOpen && children}
      </div>
    </ControlsPopover>
  )
})
