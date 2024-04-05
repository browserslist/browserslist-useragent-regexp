import type { Expression } from 'regexp-tree/ast'
import { concat } from '../utils/index.js'
import {
  AlternativeNode,
  SimpleCharNode,
  CharacterClassNode,
  ClassRangeNode,
  DisjunctionCapturingGroupNode,
  DigitPatternNode,
  optimizeSegmentNumberPatterns
} from '../regex/index.js'
import { numberToDigits } from './utils.js'

/**
 * Get digit pattern.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param zeros - Zeros to add as prefix.
 * @returns Digit pattern.
 */
export function segmentRangeNumberPattern(from: number, to: number, zeros?: number) {
  if (to < from) {
    return null
  }

  const fromNode = SimpleCharNode(from)
  const toNode = SimpleCharNode(to)
  const zerosPrefix = typeof zeros === 'number' && zeros > 0
    ? Array.from({
      length: zeros
    }, () => SimpleCharNode(0))
    : []
  const addPrefix = zerosPrefix.length
    ? (node: Expression) => AlternativeNode(zerosPrefix, node)
    : (node: Expression) => node

  if (from === to) {
    return addPrefix(fromNode)
  }

  if (from === 0 && to === 9) {
    return addPrefix(DigitPatternNode())
  }

  if (to - from === 1) {
    return addPrefix(CharacterClassNode(
      fromNode,
      toNode
    ))
  }

  return addPrefix(CharacterClassNode(
    ClassRangeNode(fromNode, toNode)
  ))
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

    if (currA === currB && diffA === '' && diffB === '') {
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
 * Get segment patterns.
 * @param from - Segment start.
 * @param to - Segment end.
 * @param digitsInNumber - How many digits should be en number. Will be filled by zeros.
 * @returns Segment patterns.
 */
export function segmentToNumberPatterns(from: number, to: number, digitsInNumber = 0): Expression[] {
  const fromDigits = numberToDigits(from)
  const digitsCount = fromDigits.length

  if (from < 10 && to < 10 || from === to) {
    const zeros = digitsInNumber - digitsCount

    return [segmentRangeNumberPattern(from, to, zeros)]
  }

  const toDigits = numberToDigits(to)

  if (digitsCount !== toDigits.length) {
    const decadeRanges = splitToDecadeRanges(from, to)
    const parts = concat(
      decadeRanges.map(([from, to]) => segmentToNumberPatterns(from, to, digitsInNumber))
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

    return [
      AlternativeNode(
        Array.from(common, SimpleCharNode),
        DisjunctionCapturingGroupNode(diffParts)
      )
    ]
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

      return AlternativeNode(
        fromDigits.map((digit, j) => {
          if (j < ri) {
            return SimpleCharNode(digit)
          }

          if (j > ri) {
            return segmentRangeNumberPattern(0, 9)
          }

          return segmentRangeNumberPattern(digit + d, 9)
        })
      )
    }),
    // but output more readable
    ...middleSegment
      ? [
        AlternativeNode(
          middleSegment,
          Array.from({
            length: digitsCount - 1
          }, () => DigitPatternNode())
        )
      ]
      : [],
    ...range.map((_, i) => {
      const ri = digitsCount - i - 1
      const d = Number(i > 0)

      return AlternativeNode(
        toDigits.map((digit, j) => {
          if (j < ri) {
            return SimpleCharNode(digit)
          }

          if (j > ri) {
            return segmentRangeNumberPattern(0, 9)
          }

          return segmentRangeNumberPattern(0, digit - d)
        })
      )
    })
  ]

  return optimizeSegmentNumberPatterns(parts)
}
