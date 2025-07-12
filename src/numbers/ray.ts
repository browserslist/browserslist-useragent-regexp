import type { Expression } from 'regexp-tree/ast'
import {
  SimpleCharNode,
  CharacterClassNode,
  ClassRangeNode,
  RangeQuantifierNode,
  AlternativeNode,
  DigitPatternNode,
  NumberPatternNode
} from '../regex/index.js'
import { numberToDigits } from './utils.js'

/**
 * Get digit pattern.
 * @param digit - Ray start.
 * @param includes - Include start digit or use next.
 * @returns Digit pattern.
 */
export function rayRangeDigitPattern(digit: number, includes: boolean) {
  const rangeStart = digit + Number(!includes)

  if (rangeStart === 0) {
    return DigitPatternNode()
  }

  if (rangeStart === 9) {
    return SimpleCharNode('9')
  }

  if (rangeStart > 9) {
    return null
  }

  return CharacterClassNode(
    ClassRangeNode(
      SimpleCharNode(rangeStart),
      SimpleCharNode('9')
    )
  )
}

/**
 * Create numeric ray pattern.
 * @param from - Start from this number.
 * @returns Numeric ray pattern parts.
 */
export function rayToNumberPatterns(from: number) {
  if (from === 0) {
    return [NumberPatternNode()]
  }

  const digits = numberToDigits(from)
  const digitsCount = digits.length
  const other = NumberPatternNode(
    RangeQuantifierNode(digitsCount + 1)
  )
  const zeros = digitsCount - 1

  if (from / Math.pow(10, zeros) === digits[0]) {
    return [
      AlternativeNode(
        rayRangeDigitPattern(digits[0], true),
        Array.from({
          length: zeros
        }, DigitPatternNode)
      ),
      other
    ]
  }

  const raysNumberPatterns = digits.reduce<Expression[][]>((topNodes, _, i) => {
    const ri = digitsCount - i - 1
    const d = i === 0
    let prev: Expression = SimpleCharNode('')
    const nodes = digits.reduce<Expression[]>((nodes, digit, j) => {
      if (j < ri) {
        nodes.push(SimpleCharNode(digit))
      } else
        if (prev) {
          if (j > ri) {
            nodes.push(DigitPatternNode())
          } else {
            prev = rayRangeDigitPattern(digit, d)

            if (prev) {
              nodes.push(prev)
            } else {
              return []
            }
          }
        }

      return nodes
    }, [])

    if (nodes.length) {
      topNodes.push(nodes)
    }

    return topNodes
  }, [])
  const numberPatterns: Expression[] = raysNumberPatterns.map(_ => AlternativeNode(_))

  numberPatterns.push(other)

  return numberPatterns
}
