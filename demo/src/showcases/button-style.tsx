import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Button } from 'mireco'

type ThemedButtonsProps = {
  className?: string
  disabled?: boolean
}

const ThemedButtons = ({
  className,
  disabled,
}: ThemedButtonsProps) => {
  const disabledSuffix = disabled ? ' (Disabled)' : ''
  return (
    <>
      <Button className={className} disabled={disabled}>
        Primary
        {disabledSuffix}
      </Button>
      {' '}
      <Button className={classNames('MIRECO-secondary', className)} disabled={disabled}>
        Secondary
        {disabledSuffix}
      </Button>
      {' '}
      <Button className={classNames('MIRECO-content', className)} disabled={disabled}>
        Content
        {disabledSuffix}
      </Button>
      {' '}
      <Button className={classNames('MIRECO-drawer', className)} disabled={disabled}>
        Drawer
        {disabledSuffix}
      </Button>
    </>
  )
}

type ThemedLinksProps = {
  className?: string
  disabled?: boolean
  suffix?: string
}

const ThemedLinks = ({
  className,
  disabled,
  suffix,
}: ThemedLinksProps) => {
  const fullSuffix = useMemo(() => {
    let s = suffix || ''
    if (disabled) {
      s += ' (Disabled)'
    }
    return s
  }, [
    disabled,
    suffix,
  ])
  return (
    <>
      <a href="#" className={classNames('MIRECO-button', className, {'MIRECO-disabled': disabled})}>
        Primary
        {fullSuffix}
      </a>
      {' '}
      <a href="#" className={classNames('MIRECO-button', 'MIRECO-secondary', className, {'MIRECO-disabled': disabled})}>
        Secondary
        {fullSuffix}
      </a>
      {' '}
      <a href="#" className={classNames('MIRECO-button', 'MIRECO-content', className, {'MIRECO-disabled': disabled})}>
        Content
        {fullSuffix}
      </a>
      {' '}
      <a href="#" className={classNames('MIRECO-button', 'MIRECO-drawer', className, {'MIRECO-disabled': disabled})}>
        Drawer
        {fullSuffix}
      </a>
    </>
  )
}

export const ButtonStyleShowcase = () => (
  <>
    <p>Standard:</p>
    <p>
      <ThemedButtons />
    </p>
    <p>
      <ThemedButtons disabled />
    </p>
    <p>Links with button classes:</p>
    <p>
      <ThemedLinks />
    </p>
    <p>
      <ThemedLinks disabled />
    </p>
  </>
)
