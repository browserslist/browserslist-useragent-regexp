import { isAllVersion } from '../semver/util.js'
import {
  NUMBER_PATTERN,
  joinParts
} from './util.js'
import { rayToNumberPatterns } from './numberRay.js'
import { segmentToNumberPatternsOrEnum } from './numberSegment.js'

/**
 * Get RegExp for given numeric range.
 * @param from - Range start.
 * @param to - Range end.
 * @returns Range pattern.
 */
export function rangeToRegExp(from: number, to = Infinity) {
  if (isAllVersion(from)) {
    return NUMBER_PATTERN
  }

  const numberPatterns = to === Infinity
    ? rayToNumberPatterns(from)
    : segmentToNumberPatternsOrEnum(from, to)
  const regExpStr = joinParts(numberPatterns)

  return regExpStr
}
