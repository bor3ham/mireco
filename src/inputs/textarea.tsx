import React, { forwardRef, useRef, useCallback, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import classNames from 'classnames'

// style taken from react-textarea-autosize (not exported)
declare type Style = Omit<NonNullable<React.TextareaHTMLAttributes<HTMLTextAreaElement>['style']>, 'maxHeight' | 'minHeight'> & {
  height?: number;
}

export interface TextareaProps {
  // mireco
  block?: boolean
  // textarea
  value?: string
  onChange(newValue: string): void
  minRows?: number
  maxRows?: number
  placeholder?: string
  maxLength?: number
  autoComplete?: string
  // html
  id?: string
  autoFocus?: boolean
  tabIndex?: number
  style?: Style
  className?: string
  title?: string
  // form
  name?: string
  required?: boolean
  disabled?: boolean
  // event handlers
  onFocus?(event?: React.FocusEvent<HTMLTextAreaElement>): void
  onBlur?(event?: React.FocusEvent<HTMLTextAreaElement>): void
  onClick?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onDoubleClick?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseDown?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseEnter?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseLeave?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseMove?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseOut?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseOver?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onMouseUp?(event: React.MouseEvent<HTMLTextAreaElement>): void
  onKeyDown?(event: React.KeyboardEvent<HTMLTextAreaElement>): void
  onKeyUp?(event: React.KeyboardEvent<HTMLTextAreaElement>): void
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  block,
  value,
  onChange,
  minRows = 2,
  maxRows = 5,
  placeholder,
  maxLength,
  autoComplete,
  id,
  autoFocus,
  tabIndex,
  style,
  className,
  title,
  name,
  required,
  disabled,
  onFocus,
  onBlur,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onKeyDown,
  onKeyUp,
}, forwardedRef) => {
  const innerRef = useRef<HTMLTextAreaElement>()
  // respond to disabled change
  useEffect(() => {
    if (!innerRef.current) {
      return
    }
    if (disabled) {
      if (innerRef.current === document.activeElement) {
        if (onBlur) {
          onBlur()
        }
      }
    } else if (innerRef.current === document.activeElement) {
      if (onFocus) {
        onFocus()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])
  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event.target.value)
    }
  }, [onChange])
  return (
    <TextareaAutosize
      ref={(instance: HTMLTextAreaElement) => {
        innerRef.current = instance
        if (typeof forwardedRef === "function") {
          forwardedRef(instance)
        } else if (forwardedRef !== null) {
          // eslint-disable-next-line no-param-reassign
          forwardedRef.current = instance
        }
      }}
      value={value || ''}
      onChange={handleChange}
      name={name}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      maxLength={maxLength}
      autoComplete={autoComplete}
      id={id}
      className={classNames(
        'MIRECO-textarea MIRECO-blockable',
        {
          block,
        },
        className,
      )}
      title={title}
      style={style}
      minRows={minRows}
      maxRows={maxRows}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  )
})
