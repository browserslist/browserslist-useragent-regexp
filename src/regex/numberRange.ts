import { isAllVersion } from '../semver/utils.js'
import {
  NUMBER_PATTERN,
  joinParts
} from './utils.js'
import { rayToNumberPatterns } from './numberRay.js'
import { segmentToNumberPatternsOrEnum } from './numberSegment.js'

/**
 * Get regex for given numeric range.
 * @param from - Range start.
 * @param to - Range end.
 * @returns Range pattern.
 */
export function rangeToRegex(from: number, to = Infinity) {
  if (isAllVersion(from)) {
    return NUMBER_PATTERN
  }

  const numberPatterns = to === Infinity
    ? rayToNumberPatterns(from)
    : segmentToNumberPatternsOrEnum(from, to)
  const regexStr = joinParts(numberPatterns)

  return regexStr
}
