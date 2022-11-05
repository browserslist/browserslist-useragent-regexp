import {
  DisjunctionCapturingGroupNode,
  NumberPatternNode
} from '../regex/index.js'
import { rayToNumberPatterns } from './ray.js'
import { segmentToNumberPatterns } from './segment.js'

/**
 * Get regex for given numeric range.
 * @param from - Range start.
 * @param to - Range end.
 * @returns Range pattern.
 */
export function rangeToRegex(from: number, to = Infinity) {
  if (from === Infinity) {
    return NumberPatternNode()
  }

  const numberPatterns = to === Infinity
    ? rayToNumberPatterns(from)
    : segmentToNumberPatterns(from, to)
  const regex = DisjunctionCapturingGroupNode(numberPatterns)

  return regex
}
