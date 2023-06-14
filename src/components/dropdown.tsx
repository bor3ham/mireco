import React, { forwardRef, useCallback, useRef, useEffect, useMemo } from 'react'
import classNames from 'classnames'

interface Option {
  value: any
  label: string
}

interface DropdownOptionProps {
  option: Option
  onSelect(value: any): void
  current: boolean
  disabled?: boolean
}

const DropdownOption = forwardRef<HTMLLIElement, DropdownOptionProps>(({
  option,
  onSelect,
  current,
  disabled,
}, ref) => {
  const handleClick = useCallback(() => {
    onSelect(option.value)
  }, [onSelect, option])
  return (
    <li
      className={classNames({
        current,
      })}
      ref={ref}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={handleClick}
      >
        {option.label}
      </button>
    </li>
  )
})

export interface DropdownProps {
  options: Option[]
  value: any
  onSelect?(value: any): void
  disabled?: boolean
  beforeOptions?: React.ReactNode
  afterOptions?: React.ReactNode
  noOptionsPrompt?: string
}

export const Dropdown = forwardRef<HTMLUListElement, DropdownProps>(({
  options,
  value,
  onSelect,
  disabled,
  beforeOptions,
  afterOptions,
  noOptionsPrompt = 'No options',
}, forwardedRef) => {
  const listRef = useRef<HTMLUListElement>()
  const currentRef = useRef<HTMLLIElement>(null)

  const focusOnCurrent = useCallback(() => {
    if (listRef.current && currentRef.current) {
      // don't use scroll into view because this also scrolls parent containers (the body included)
      const currentOption = currentRef.current
      const currentTop = currentOption.offsetTop
      const currentBottom = currentTop + currentOption.getBoundingClientRect().height
      const list = listRef.current
      const viewBottom = list.scrollTop + list.getBoundingClientRect().height
      if (list.scrollTop > currentTop) {
        list.scrollTop = currentTop
      }
      if (currentBottom > viewBottom) {
        list.scrollTop = currentBottom - list.getBoundingClientRect().height
      }
    }
  }, [])

  useEffect(() => {
    if (typeof value !== 'undefined' && value !== null) {
      focusOnCurrent()
    }
  }, [value, focusOnCurrent])

  const handleSelect = useCallback((selected: any) => {
    if (onSelect) {
      onSelect(selected)
    }
  }, [onSelect])

  const contents = useMemo(() => {
    if (options.length) {
      return options.map((option) => {
        let extraProps = {}
        const current = option.value === value
        if (current) {
          extraProps = {
            ref: currentRef,
          }
        }
        return (
          <DropdownOption
            {...extraProps}
            key={`option-${option.value}`}
            option={option}
            current={current}
            disabled={disabled}
            onSelect={handleSelect}
          />
        )
      })
    }
      return (<li className="none">{noOptionsPrompt}</li>)
  }, [
    options,
    value,
    disabled,
    handleSelect,
    noOptionsPrompt,
  ])
  return (
    <ul
      className={classNames('MIRECO-dropdown', {
        disabled,
      })}
      tabIndex={-1}
      ref={(instance: HTMLUListElement) => {
        listRef.current = instance
        if (typeof forwardedRef === "function") {
          forwardedRef(instance)
        } else if (forwardedRef !== null) {
          // eslint-disable-next-line no-param-reassign
          forwardedRef.current = instance
        }
      }}
    >
      {beforeOptions}
      {contents}
      {afterOptions}
    </ul>
  )
})
