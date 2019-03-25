import {
	isAllVersion
} from '../semver/util';
import {
	NUMBER_PATTERN,
	joinParts
} from './util';
import {
	rayToNumberPatterns
} from './numberRay';
import {
	segmentToNumberPatternsOrEnum
} from './numberSegment';

/**
 * Get RegExp for given numeric range.
 * @param  from - Range start.
 * @param  to - Range end.
 * @return Range pattern.
 */
export function rangeToRegExp(from: number, to = Infinity) {

	if (isAllVersion(from)) {
		return NUMBER_PATTERN;
	}

	const numberPatterns = to === Infinity
		? rayToNumberPatterns(from)
		: segmentToNumberPatternsOrEnum(from, to);
	const regExpStr = joinParts(numberPatterns);

	return regExpStr;
}
