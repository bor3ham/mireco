export function expandPatterns(patterns: string[], match: string, expand: string[]): string[] {
  const expanded: string[] = []
  patterns.forEach((pattern) => {
    expanded.push(pattern)
    if (pattern.indexOf(match) !== -1) {
      expand.forEach((alternative) => {
        expanded.push(pattern.replace(match, alternative))
      })
    }
  })
  return expanded
}

export const DELIMETERS = /\-|\.|\,|\\|\/|\:/g

export const SPACES = /\s+/g
