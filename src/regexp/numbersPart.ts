import {
  BRACED_NUMBER_PATTERN,
  ESCAPE_SYMBOL,
  getNumberPatternsCount,
  regExpToString,
  skipSquareBraces,
  capturePostfix
} from './util.js'

/**
 * Get from RegExp part with number patterns.
 * @todo   Optimize.
 *   E.g.: (HeadlessChrome)(?:\/(\d+)\.(\d+)\.(\d+))?
 *   now: (?:\/(\d+)\.(\d+)\.(\d+))?
 *   need: (\d+)\.(\d+)\.(\d+)
 * @param regExp - Target RegExp.
 * @param numberPatternsCount - Number patterns to extract.
 * @returns RegExp part with number patterns.
 */
export function getNumberPatternsPart(regExp: string|RegExp, numberPatternsCount?: number) {
  const regExpStr = typeof regExp === 'string'
    ? regExp
    : regExpToString(regExp)
  const regExpStrLength = regExpStr.length
  const maxNumbersCount = typeof numberPatternsCount === 'number'
    ? numberPatternsCount
    : getNumberPatternsCount(regExpStr)
  let braceBalance = 0
  let skip = false
  let numberCounter = 0
  let char = ''
  let prevChar = ''
  let numberAccum = ''
  let numberPatternsPart = ''

  for (let i = 0; i < regExpStrLength; i++) {
    char = regExpStr[i]
    prevChar = regExpStr[i - 1]
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
        numberPatternsPart += capturePostfix(regExpStr, ++i)
        break
      }
    }
  }

  return numberPatternsPart
}
