import {
	BRACED_NUMBER_PATTERN,
	ESCAPE_SYMBOL,
	skipSquareBraces,
	capturePostfix
} from './util';

export const OPTIMIZABLE_GROUP = /^\([\s\w\d_\-/!]+\)$/;
export const CHARCLASS_UNESCAPES = /[/.$*+?[{}|()]/;

/**
 * Optimize RegExp string:
 * - remove unnecessary braces;
 * - remove unnecessary escapes in ranges.
 * @param  regExpStr - RegExp string to optimize.
 * @return Optimized RegExp string.
 */
export function optimize(regExpStr: string) {

	const regExpStrLength = regExpStr.length;
	let inGroup = false;
	let skip = false;
	let char = '';
	let prevChar = '';
	let nextChar = '';
	let postfix = '';
	let groupAccum = '';
	let optimizedRegExpStr = '';

	for (let i = 0; i < regExpStrLength; i++) {

		char = regExpStr[i];
		prevChar = regExpStr[i - 1];
		nextChar = regExpStr[i + 1];
		skip = skipSquareBraces(skip, prevChar, char);

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& char === '('
		) {

			if (inGroup) {
				optimizedRegExpStr += groupAccum;
			}

			inGroup = true;
			groupAccum = '';
		}

		if (skip
			&& char === ESCAPE_SYMBOL
			&& CHARCLASS_UNESCAPES.test(nextChar)
		) {
			i++;
			char = nextChar;
		}

		if (inGroup) {
			groupAccum += char;
		} else {
			optimizedRegExpStr += char;
		}

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& char === ')'
			&& inGroup
		) {

			inGroup = false;
			postfix = capturePostfix(regExpStr, i + 1);
			groupAccum += postfix;

			if (groupAccum === BRACED_NUMBER_PATTERN
				|| OPTIMIZABLE_GROUP.test(groupAccum)
			) {
				groupAccum = groupAccum.substr(1, groupAccum.length - 2);
			}

			optimizedRegExpStr += groupAccum;
			i += postfix.length;
		}
	}

	return optimizedRegExpStr;
}
