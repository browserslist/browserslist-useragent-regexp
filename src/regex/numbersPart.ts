import {
  BRACED_NUMBER_PATTERN,
  ESCAPE_SYMBOL,
  getNumberPatternsCount,
  regexToString,
  skipSquareBraces,
  capturePostfix
} from './utils.js'

/**
 * Get from regex part with number patterns.
 * @todo   Optimize.
 *   E.g.: (HeadlessChrome)(?:\/(\d+)\.(\d+)\.(\d+))?
 *   now: (?:\/(\d+)\.(\d+)\.(\d+))?
 *   need: (\d+)\.(\d+)\.(\d+)
 * @param regex - Target regex.
 * @param numberPatternsCount - Number patterns to extract.
 * @returns Regex part with number patterns.
 */
export function getNumberPatternsPart(regex: string | RegExp, numberPatternsCount?: number) {
  const regexStr = typeof regex === 'string'
    ? regex
    : regexToString(regex)
  const regexStrLength = regexStr.length
  const maxNumbersCount = typeof numberPatternsCount === 'number'
    ? numberPatternsCount
    : getNumberPatternsCount(regexStr)
  let braceBalance = 0
  let skip = false
  let numberCounter = 0
  let char = ''
  let prevChar = ''
  let numberAccum = ''
  let numberPatternsPart = ''

  for (let i = 0; i < regexStrLength; i++) {
    char = regexStr[i]
    prevChar = regexStr[i - 1]
    skip = skipSquareBraces(skip, prevChar, char)

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && char === '('
    ) {
      braceBalance++
      numberAccum = ''
    }

    if (braceBalance > 0 || numberCounter > 0) {
      numberPatternsPart += char
      numberAccum += char
    }

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && char === ')'
      && braceBalance > 0
    ) {
      braceBalance--

      if (numberAccum === BRACED_NUMBER_PATTERN) {
        numberCounter++
      }

      if (braceBalance === 0
        && numberCounter === 0
      ) {
        numberPatternsPart = ''
      }

      if (braceBalance === 0
        && numberCounter >= maxNumbersCount
      ) {
        numberPatternsPart += capturePostfix(regexStr, ++i)
        break
      }
    }
  }

  return numberPatternsPart
}
