import {
  DIGIT_PATTERN,
  numberToDigits,
  joinParts
} from './util'

/**
 * Get digit pattern.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param zeros - Zeros to add as prefix.
 * @returns Digit pattern.
 */
export function segmentRangeNumberPattern(from: number, to: number, zeros?: number) {
  if (to < from) {
    return ''
  }

  const zerosPrefix = typeof zeros === 'number' && zeros > 0
    ? '0'.repeat(zeros)
    : ''

  if (from === to) {
    return `${zerosPrefix}${from}`
  }

  if (from === 0 && to === 9) {
    return `${zerosPrefix}${DIGIT_PATTERN}`
  }

  return `${zerosPrefix}[${from}-${to}]`
}

/**
 * Split segment range to decade ranges.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Ranges.
 */
export function splitToDecadeRanges(from: number, to: number) {
  const ranges: [number, number][] = []
  let num = from
  let decade = 1

  do {
    decade *= 10

    if (num < decade) {
      ranges.push([num, Math.min(decade - 1, to)])
      num = decade
    }
  } while (decade <= to)

  return ranges
}

/**
 * Get common and diffs of two numbers (arrays of digits).
 * @param a - Digits.
 * @param b - Other digits.
 * @returns Common part and diffs.
 */
export function splitCommonDiff(a: number[], b: number[]): [string, number, number] {
  const len = a.length

  if (len !== b.length || a[0] !== b[0]) {
    return null
  }

  let common = a[0].toString()
  let currA = 0
  let currB = 0
  let diffA = ''
  let diffB = ''

  for (let i = 1; i < len; i++) {
    currA = a[i]
    currB = b[i]

    if (currA === currB) {
      common += currA
    } else {
      diffA += currA
      diffB += currB
    }
  }

  return [
    common,
    parseInt(diffA, 10),
    parseInt(diffB, 10)
  ]
}

/**
 * Get shirter variant.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param rangeNumberPatterns - Numeric segment patterns.
 * @returns Enum or numeric segment patterns.
 */
export function enumOrRange(from: number, to: number, rangeNumberPatterns: string[]) {
  const rangePartsCount = rangeNumberPatterns.length
  const nums: string[] = []
  let rangeIndex = 0
  let rangeSymbolsCount = 0
  let enumSymbolsCount = 0

  for (let num = from; num <= to; num++) {
    nums.push(num.toString())
    enumSymbolsCount += Math.floor(Math.log10(num) + 1) + 1

    while (enumSymbolsCount > rangeSymbolsCount) {
      if (rangeIndex >= rangePartsCount) {
        return rangeNumberPatterns
      }

      rangeSymbolsCount += rangeNumberPatterns[rangeIndex++].length + 1
    }
  }

  return nums
}

/**
 * Get segment patterns.
 * @todo   Optomize. E.g. 32-99.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param digitsInNumber - How many digits should be en number. Will be filled by zeros.
 * @returns Segment patterns.
 */
export function segmentToNumberPatterns(from: number, to: number, digitsInNumber = 0): string[] {
  const fromDigits = numberToDigits(from)
  const digitsCount = fromDigits.length

  if (from < 10 && to < 10 || from === to) {
    const zeros = digitsInNumber - digitsCount

    return [segmentRangeNumberPattern(from, to, zeros)]
  }

  const toDigits = numberToDigits(to)

  if (digitsCount !== toDigits.length) {
    const decadeRanges = splitToDecadeRanges(from, to)
    const parts = ([] as string[]).concat(
      ...decadeRanges.map(([from, to]) => segmentToNumberPatterns(from, to, digitsInNumber))
    )

    return parts
  }

  const commonStart = splitCommonDiff(fromDigits, toDigits)

  if (Array.isArray(commonStart)) {
    const [
      common,
      from,
      to
    ] = commonStart
    const digitsInNumber = digitsCount - common.length
    const diffParts = segmentToNumberPatterns(from, to, digitsInNumber)

    return [`${common}${joinParts(diffParts)}`]
  }

  const range = Array.from({
    length: digitsCount - 1
  })
  const middleSegment = segmentRangeNumberPattern(
    fromDigits[0] + 1,
    toDigits[0] - 1
  )
  const parts = [
    ...range.map((_, i) => {
      const ri = digitsCount - i - 1
      const d = Number(i > 0)

      return fromDigits.map((digit, j) => {
        if (j < ri) {
          return digit
        }

        if (j > ri) {
          return segmentRangeNumberPattern(0, 9)
        }

        return segmentRangeNumberPattern(digit + d, 9)
      }).join('')
    }),
    // but output more readable
    ...middleSegment
      ? [`${middleSegment}${DIGIT_PATTERN.repeat(digitsCount - 1)}`]
      : [],
    ...range.map((_, i) => {
      const ri = digitsCount - i - 1
      const d = Number(i > 0)

      return toDigits.map((digit, j) => {
        if (j < ri) {
          return digit
        }

        if (j > ri) {
          return segmentRangeNumberPattern(0, 9)
        }

        return segmentRangeNumberPattern(0, digit - d)
      }).join('')
    })
  ]

  return parts
}

/**
 * Get segment or enum patterns.
 * @param from - Segment start.
 * @param to - Segment end.
 * @returns Enum or numeric segment patterns.
 */
export function segmentToNumberPatternsOrEnum(from: number, to: number) {
  return enumOrRange(from, to, segmentToNumberPatterns(from, to))
}
