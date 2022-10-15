import type { BrowserVersionedRegex } from '../useragent/types.js'
import { optimize } from '../regex/optimize.js'

/**
 * Optimize all regexes.
 * @param regexes - Objects with info about compiled regexes.
 * @returns Objects with info about optimized regexes.
 */
export function optimizeAll(regexes: BrowserVersionedRegex[]) {
  return regexes.map<BrowserVersionedRegex>(({
    regexString,
    ...regex
  }) => {
    const optimizedRegexStr = optimize(regexString)
    const optimizedRegex = new RegExp(optimizedRegexStr)

    return {
      ...regex,
      regex: optimizedRegex,
      regexString: optimizedRegexStr
    }
  })
}
