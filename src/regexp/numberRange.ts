import {
	isAllVersion
} from '../semver';
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
