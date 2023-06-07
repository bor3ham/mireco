export type Empty = null | undefined

export function isEmpty(value: any): boolean {
  return (value === null || typeof value === 'undefined')
}
