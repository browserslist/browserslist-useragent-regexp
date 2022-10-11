import type { IBrowserVersionedRegExp } from '../useragent/types.js'
import { optimize } from '../regexp/optimize.js'

/**
 * Optimize all RegExps.
 * @param regExps - Objects with info about compiled RegExps.
 * @returns Objects with info about optimized RegExps.
 */
export function optimizeAll(regExps: IBrowserVersionedRegExp[]) {
  return regExps.map<IBrowserVersionedRegExp>(({
    regExpString,
    ...regExp
  }) => {
    const optimizedRegExpStr = optimize(regExpString)
    const optimizedRegExp = new RegExp(optimizedRegExpStr)

    return {
      ...regExp,
      regExp: optimizedRegExp,
      regExpString: optimizedRegExpStr
    }
  })
}
