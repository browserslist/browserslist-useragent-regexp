import type { BrowserVersionedRegex } from '../useragent/types.js'

export const DIGIT_PATTERN = '\\d'
export const NUMBER_PATTERN = `${DIGIT_PATTERN}+`
export const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`
export const ESCAPE_SYMBOL = '\\'

/**
 * Join regex parts with "or".
 * @param parts - Some regex parts.
 * @param wrapRequired - Should always wrap with braces.
 * @returns Joined parts.
 */
export function joinParts(parts: string[], wrapRequired = false) {
  const joined = parts.join('|')

  return wrapRequired || parts.length > 1
    ? `(${joined})`
    : joined
}

/**
 * Join regexes with "or".
 * @param versionedBrowsersRegexes - Regexes strings array.
 * @returns Joined regexes string.
 */
export function joinVersionedBrowsersRegexes(versionedBrowsersRegexes: BrowserVersionedRegex[]) {
  return versionedBrowsersRegexes
    .map(_ => `(${_.regexString})`)
    .join('|')
}

/**
 * Find number patterns count.
 * @param regex - Target string or regex.
 * @returns Number patterns count.
 */
export function getNumberPatternsCount(regex: string | RegExp) {
  return regex.toString().split(BRACED_NUMBER_PATTERN).length - 1
}

/**
 * Convert regex to string without slashes.
 * @param regex - Target regex.
 * @returns Regex string without slashes.
 */
export function regexToString(regex: RegExp) {
  return regex
    .toString()
    .replace(/^\/|\/$/g, '')
}

/**
 * Replace number patterns.
 * @param regex - Target regex.
 * @param numbers - Number patterns to paste.
 * @param numberPatternsCount - Number patterns count to replace.
 * @returns Regex string with replaced number patterns.
 */
export function replaceNumberPatterns(
  regex: string | RegExp,
  numbers: string[],
  numberPatternsCount?: number
) {
  const strRegex = typeof regex === 'string'
    ? regex
    : regexToString(regex)
  const numbersToReplace = typeof numberPatternsCount === 'number'
    && numberPatternsCount < numbers.length
    ? numbers.slice(0, numberPatternsCount)
    : numbers
  const numberedStrRegex = numbersToReplace.reduce(
    (_, num) => _.replace(BRACED_NUMBER_PATTERN, num),
    strRegex
  )

  return numberedStrRegex
}

/**
 * Transform number to digits array.
 * @param num - Target number.
 * @returns Digits array.
 */
export function numberToDigits(num: string|number) {
  return Array.from(num.toString()).map(Number)
}

/**
 * Skip every char inside square braces.
 * @param skip - Current skip state.
 * @param prevChar - Previous char.
 * @param char - Current char to check.
 * @returns Should skip this char or not.
 */
export function skipSquareBraces(skip: boolean, prevChar: string, char: string) {
  if (char === '['
    && prevChar !== ESCAPE_SYMBOL
  ) {
    return true
  }

  if (char === ']'
    && prevChar !== ESCAPE_SYMBOL
  ) {
    return false
  }

  return skip
}

/**
 * Get possible regex group postfix.
 * @param regexStr - Whole regex string.
 * @param startFrom - Index to start capture.
 * @returns Regex group postfix part.
 */
export function capturePostfix(regexStr: string, startFrom: number) {
  let char = regexStr[startFrom]

  switch (char) {
    case '+':
    case '*':
    case '?':
      return char

    case '(': {
      const nextChar = regexStr[startFrom + 1]
      const afterNextChar = regexStr[startFrom + 2]

      if (
        nextChar !== '?'
        || afterNextChar !== '=' && afterNextChar !== '!'
      ) {
        return ''
      }

      break
    }

    case '{':
      break

    default:
      return ''
  }

  const regexStrLength = regexStr.length
  let prevChar = ''
  let braceBalance = 0
  let skip = false
  let postfix = ''

  for (let i = startFrom; i < regexStrLength; i++) {
    char = regexStr[i]
    prevChar = regexStr[i - 1]
    skip = skipSquareBraces(skip, prevChar, char)

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && (
        char === '('
        || char === '{'
      )
    ) {
      braceBalance++
    }

    if (braceBalance > 0) {
      postfix += char
    }

    if (!skip
      && prevChar !== ESCAPE_SYMBOL
      && braceBalance > 0
      && (
        char === ')'
        || char === '}'
      )
    ) {
      braceBalance--

      if (braceBalance === 0) {
        break
      }
    }
  }

  return postfix
}
