import {
  BRACED_NUMBER_PATTERN,
  ESCAPE_SYMBOL,
  skipSquareBraces,
  capturePostfix
} from './utils.js'

export const OPTIMIZABLE_GROUP = /^\([\s\w\d_\-/!]+\)$/
export const CHARCLASS_UNESCAPES = /[/.$*+?[{}|()]/

/**
 * Optimize regex string:
 * - remove unnecessary braces;
 * - remove unnecessary escapes in ranges.
 * @param regexStr - Regex string to optimize.
 * @returns Optimized regex string.
 */
export function optimize(regexStr: string) {
  const regexStrLength = regexStr.length
  let inGroup = false
  let skip = false
  let char = ''
  let prevChar = ''
  let nextChar = ''
  let postfix = ''
  let groupAccum = ''
  let optimizedRegexStr = ''

  for (let i = 0; i < regexStrLength; i++) {
    char = regexStr[i]
    prevChar = regexStr[i - 1]
    nextChar = regexStr[i + 1]
    skip = skipSquareBraces(skip, prevChar, char)

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && char === '('
    ) {
      if (inGroup) {
        optimizedRegexStr += groupAccum
      }

      inGroup = true
      groupAccum = ''
    }

    if (skip
      && char === ESCAPE_SYMBOL
      && CHARCLASS_UNESCAPES.test(nextChar)
    ) {
      i++
      char = nextChar
    }

    if (inGroup) {
      groupAccum += char
    } else {
      optimizedRegexStr += char
    }

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && char === ')'
      && inGroup
    ) {
      inGroup = false
      postfix = capturePostfix(regexStr, i + 1)
      groupAccum += postfix

      if (groupAccum === BRACED_NUMBER_PATTERN
        || OPTIMIZABLE_GROUP.test(groupAccum)
      ) {
        groupAccum = groupAccum.substr(1, groupAccum.length - 2)
      }

      optimizedRegexStr += groupAccum
      i += postfix.length
    }
  }

  return optimizedRegexStr
}
