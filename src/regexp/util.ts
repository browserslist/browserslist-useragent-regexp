import {
	IBrowserVersionedRegExp
} from '../useragent';

export const DIGIT_PATTERN = '\\d';
export const NUMBER_PATTERN = `${DIGIT_PATTERN}+`;
export const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`;
export const ESCAPE_SYMBOL = '\\';

/**
 * Join RegExp parts with "or".
 * @param  parts - Some RegExp parts.
 * @param  wrapRequired - Should always wrap with braces.
 * @return Joined parts.
 */
export function joinParts(parts: string[], wrapRequired = false) {

	const joined = parts.join('|');

	return wrapRequired || parts.length > 1
		? `(${joined})`
		: joined;
}

/**
 * Join RegExps with "or".
 * @param  versionedBrowsersRegExps - RegExps strings array.
 * @return Joined RegExps string.
 */
export function joinVersionedBrowsersRegExps(versionedBrowsersRegExps: IBrowserVersionedRegExp[]) {
	return versionedBrowsersRegExps
		.map(_ => `(${_.regExpString})`)
		.join('|');
}

/**
 * Contains number pattern or not.
 * @param  regExp - Target string or RegExp.
 * @return Has or not.
 */
export function hasNumberPattern(regExp: string|RegExp) {
	return regExp.toString().includes(BRACED_NUMBER_PATTERN);
}

/**
 * Find number patterns count.
 * @param regExp - Target string or RegExp.
 * @return Number patterns count.
 */
export function getNumberPatternsCount(regExp: string|RegExp) {
	return regExp.toString().split(BRACED_NUMBER_PATTERN).length - 1;
}

/**
 * Convert RegExp to string without slashes.
 * @param  regExp - Target RegExp.
 * @return RegExp string without slashes.
 */
export function regExpToString(regExp: RegExp) {
	return regExp
		.toString()
		.replace(/^\/|\/$/g, '');
}

/**
 * Replace number patterns.
 * @param  regExp - Target RegExp.
 * @param  numbers - Number patterns to paste.
 * @param  numberPatternsCount - Number patterns count to replace.
 * @return RegExp string with replaced number patterns.
 */
export function replaceNumberPatterns(
	regExp: string|RegExp,
	numbers: string[],
	numberPatternsCount?: number
) {

	const strRegExp = typeof regExp === 'string'
		? regExp
		: regExpToString(regExp);
	const numbersToReplace = typeof numberPatternsCount === 'number'
		&& numberPatternsCount < numbers.length
			? numbers.slice(0, numberPatternsCount)
			: numbers;
	const numberedStrRegExp = numbersToReplace.reduce(
		(_, num) => _.replace(BRACED_NUMBER_PATTERN, num),
		strRegExp
	);

	return numberedStrRegExp;
}

/**
 * Transform number to digits array.
 * @param  num - Target number.
 * @return Digits array.
 */
export function numberToDigits(num: string|number) {
	return Array.from(num.toString()).map(Number);
}
