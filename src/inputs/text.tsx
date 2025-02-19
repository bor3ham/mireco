import React, { useCallback, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'

import type { MirecoInputProps } from 'types/mireco'

export type TextRef = {
  focus(): void
  element: HTMLInputElement | null
}

export type TextProps = Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange'> & {
  ref?: React.Ref<TextRef>
  onChange?(newValue: string, event: React.ChangeEvent<HTMLInputElement>): void
} & MirecoInputProps

export const Text = ({
  ref,
  onChange,
  block,
  ...vanillaProps
}: TextProps) => {
  const innerRef = useRef<HTMLInputElement>(null)
  const focus = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.focus()
    }
  }, [])
  useImperativeHandle(ref, () => ({
    focus,
    element: innerRef.current,
  }), [
    focus,
  ])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (onChange) {
      onChange(newValue, event)
    }
  }, [onChange])

  return (
    <input
      ref={innerRef}
      {...vanillaProps}
      className={classNames(
        'MIRECO-text MIRECO-blockable',
        {
          'MIRECO-block': block,
          'MIRECO-sized': !!vanillaProps.size,
        },
        vanillaProps.className,
      )}
      onChange={handleChange}
    />
  )
}
