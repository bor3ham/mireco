export const ISO_8601_DATE_FORMAT = 'yyyy-MM-dd'
export const ISO_8601_MONTH_FORMAT = 'yyyy-MM'

export const KEYBOARD_ARROW_DOWN = 40
export const KEYBOARD_ARROW_UP = 38
export const KEYBOARD_ENTER = 13
export const KEYBOARD_ESCAPE = 27
export const KEYBOARD_BACKSPACE = 8
export const KEYBOARD_TAB = 9
export const KEYBOARD_SHIFT = 16
export const KEYBOARD_CAPS = 20

export const SUPPORTED_LOCALES = [
  'en-AU',
  'en-GB',
  'en-US',
]
export const DEFAULT_LOCALE = 'en-GB'
export function getSafeLocale(locale?: string): string {
  if (locale) {
    if (SUPPORTED_LOCALES.includes(locale)) return locale
    console.warn(`Mireco does not yet support specified locale "${locale}", falling back to browser`)
  }
  const browserLocale = new Intl.DateTimeFormat().resolvedOptions().locale
  if (SUPPORTED_LOCALES.includes(browserLocale)) return browserLocale
  console.warn(`Mireco does not yet support browser locale "${browserLocale}", falling back to default "${DEFAULT_LOCALE}"`)
  return DEFAULT_LOCALE
}
