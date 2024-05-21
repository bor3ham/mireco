import React, { useState, useCallback, useMemo } from 'react'
import { Date as DateInput, type DateInputValue } from 'mireco'

interface LocalisedDateProps {
  locale?: string
  children: React.ReactNode
}

const LocalisedDate: React.FC<LocalisedDateProps> = ({
  locale,
  children,
}) => {
  const [value, setValue] = useState<DateInputValue>('2003-02-01')
  const handleChange = useCallback((newValue: DateInputValue) => {
    setValue(newValue)
  }, [])
  return (
    <>
      {children}
      <p>Current value: {JSON.stringify(value)}</p>
      <DateInput value={value} onChange={handleChange} block locale={locale}/>
    </>
  )
}

export const Localisation = () => {
  const browserLocale = useMemo(() => {
    return new Intl.DateTimeFormat().resolvedOptions().locale
  }, [])
  return (
    <>
      <LocalisedDate>Browser ({browserLocale})</LocalisedDate>
      <LocalisedDate locale="en-AU">English (Australia)</LocalisedDate>
      <LocalisedDate locale="en-US">English (United States)</LocalisedDate>
      <LocalisedDate locale="en-GB">English (Great Britain)</LocalisedDate>
      <LocalisedDate locale="ko">Korean (not supported)</LocalisedDate>
    </>
  )
}
