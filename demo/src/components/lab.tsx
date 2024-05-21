import React, { createContext, useState, useCallback, useEffect } from 'react'
import { Checkbox, Range, Button } from 'mireco'

import { ResizeContainer } from './resize-container'

export const LabContext = createContext<{
  value: any
  onChange(newValue: any): void
  block: boolean
  randomise: boolean
  disabled: boolean
}>({
  value: null,
  onChange: (newValue: any) => {},
  block: false,
  randomise: false,
  disabled: false,
})

interface FrequencyToggleProps {
  enabled: boolean
  frequency: number
  onEnabledChanged(newValue: boolean): void
  onFrequencyChanged(newValue: number): void
  children: React.ReactNode
}

const FrequencyToggle = ({
  enabled,
  frequency,
  onEnabledChanged,
  onFrequencyChanged,
  children,
}: FrequencyToggleProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '1rem',
    }}>
      <Checkbox style={{flex: '1'}} value={enabled} onChange={onEnabledChanged}>{children}</Checkbox>
      <Range style={{flex: '1'}} min={250} max={10000} step={250} value={frequency} onChange={onFrequencyChanged} />
      <p style={{flex: '1', margin: 0, marginLeft: '1rem'}}>Every {frequency} ms</p>
    </div>
  )
}

const stringifyFormValue = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  return JSON.stringify(value)
}

interface LabWrapperProps {
  children: React.ReactNode
  initialValue: any
  getRandomValue(): any
  stringify(value: any): string
  showSubmit?: boolean
}

export const LabWrapper = ({
  children,
  initialValue,
  getRandomValue,
  stringify,
  showSubmit = false,
}: LabWrapperProps) => {
  const [state, setState] = useState({
    value: initialValue,
    styles: true,
    block: false,
    remount: false,
    remountFrequency: 2000,
    randomise: false,
    randomiseFrequency: 2000,
    disabled: false,
    disable: false,
    disableFrequency: 2000,
  })
  const handleStateValueChange = useCallback((name: string, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }, [])

  const [mountIndex, setMountIndex] = useState(1)
  const remount = useCallback(() => {
    setMountIndex(prevIndex => (prevIndex + 1))
  }, [])
  useEffect(() => {
    if (state.remount) {
      const interval = window.setInterval(remount, state.remountFrequency)
      return () => {
        window.clearInterval(interval)
      }
    }
    return () => {}
  }, [remount, state.remount, state.remountFrequency])

  const randomise = useCallback(() => {
    handleStateValueChange('value', getRandomValue())
  }, [getRandomValue, handleStateValueChange])
  useEffect(() => {
    if (state.randomise) {
      const interval = window.setInterval(randomise, state.randomiseFrequency)
      return () => {
        window.clearInterval(interval)
      }
    }
    return () => {}
  }, [randomise, state.randomise, state.randomiseFrequency])

  const toggleDisabled = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      disabled: !prevState.disabled,
    }))
  }, [])
  useEffect(() => {
    if (state.disable) {
      const interval = window.setInterval(toggleDisabled, state.disableFrequency)
      return () => {
        window.clearInterval(interval)
      }
    }
    return () => {}
  }, [toggleDisabled, state.disable, state.disableFrequency])

  const [submittedValue, setSubmittedValue] = useState<any>(undefined)
  const [lastSubmitted, setLastSubmitted] = useState<Date | undefined>(undefined)
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    setSubmittedValue(Object.fromEntries(formData))
    setLastSubmitted(new Date())
  }, [])
  
  const handleValueChange = useCallback((newValue: any) => {
    handleStateValueChange('value', newValue)
  }, [handleStateValueChange])
  const handleStylesChange = useCallback((newValue: boolean) => {
    handleStateValueChange('styles', newValue)
  }, [handleStateValueChange])
  const handleBlockChange = useCallback((newValue: boolean) => {
    handleStateValueChange('block', newValue)
  }, [handleStateValueChange])
  const handleRemountEnabledChange = useCallback((newValue: boolean) => {
    handleStateValueChange('remount', newValue)
  }, [handleStateValueChange])
  const handleRemountFrequencyChange = useCallback((newValue: number) => {
    handleStateValueChange('remountFrequency', newValue)
  }, [handleStateValueChange])
  const handleRandomiseEnabledChange = useCallback((newValue: boolean) => {
    handleStateValueChange('randomise', newValue)
  }, [handleStateValueChange])
  const handleRandomiseFrequencyChange = useCallback((newValue: number) => {
    handleStateValueChange('randomiseFrequency', newValue)
  }, [handleStateValueChange])
  const handleDisabledChange = useCallback((newValue: boolean) => {
    handleStateValueChange('disabled', newValue)
  }, [])
  const handleDisableEnabledChange = useCallback((newValue: boolean) => {
    handleStateValueChange('disable', newValue)
  }, [handleStateValueChange])
  const handleDisableFrequencyChange = useCallback((newValue: number) => {
    handleStateValueChange('disableFrequency', newValue)
  }, [handleStateValueChange])

  return (
    <LabContext.Provider value={{
      ...state,
      onChange: handleValueChange,
    }}>
      {state.styles && (
        <link href="../../dist/demo.css" rel="stylesheet" />
      )}
      <div className="lab-controls">
        <Checkbox block value={state.styles} onChange={handleStylesChange}>Include CSS</Checkbox>
        <Checkbox block value={state.block} onChange={handleBlockChange}>Block mode</Checkbox>
        <FrequencyToggle
          enabled={state.remount}
          frequency={state.remountFrequency}
          onEnabledChanged={handleRemountEnabledChange}
          onFrequencyChanged={handleRemountFrequencyChange}
        >
          Periodically remount
        </FrequencyToggle>
        <p style={{margin: 0, marginBottom: '1rem'}}>
          <Button onClick={remount}>Remount</Button>
        </p>
        <FrequencyToggle
          enabled={state.randomise}
          frequency={state.randomiseFrequency}
          onEnabledChanged={handleRandomiseEnabledChange}
          onFrequencyChanged={handleRandomiseFrequencyChange}
        >
          Periodically randomise
        </FrequencyToggle>
        <p style={{margin: 0, marginBottom: '1rem'}}>
          <Button onClick={randomise}>Randomise</Button>
        </p>
        <FrequencyToggle
          enabled={state.disable}
          frequency={state.disableFrequency}
          onEnabledChanged={handleDisableEnabledChange}
          onFrequencyChanged={handleDisableFrequencyChange}
        >
          Periodically disable
        </FrequencyToggle>
        <Checkbox
          block
          value={state.disabled}
          onChange={handleDisabledChange}
        >
          Disabled
        </Checkbox>
      </div>
      <div key={`mount-${mountIndex}`} style={{marginBottom: '1rem'}}>
        <form onSubmit={handleSubmit}>
          <ResizeContainer>
            {children}
            {' '}
            <Button type="submit" hidden={!showSubmit} disabled={state.disabled}>Submit</Button>
          </ResizeContainer>
        </form>
      </div>
      <div className="lab-controls" style={{marginTop: '15rem'}}>
        <p><code>Current value: {stringify(state.value)}</code></p>
        <p><code>Last submitted value: {stringifyFormValue(submittedValue)}</code></p>
        <p><code>Last submitted at: {lastSubmitted ? lastSubmitted.toString() : 'undefined'}</code></p>
      </div>
    </LabContext.Provider>
  )
}
