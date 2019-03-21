import {
	IBrowserVersionedRegExp
} from '../useragent';

export const DIGIT_PATTERN = '\\d';
export const NUMBER_PATTERN = `${DIGIT_PATTERN}+`;
export const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`;
export const ESCAPE_SYMBOL = '\\';

export function joinParts(parts: string[], wrapRequired = false) {

	const joined = parts.join('|');

	return wrapRequired || parts.length > 1
		? `(${joined})`
		: joined;
}

export function joinVersionedBrowsersRegExps(versionedBrowsersRegExps: IBrowserVersionedRegExp[]) {
	return versionedBrowsersRegExps
		.map(_ => `(${_.regExpString})`)
		.join('|');
}

export function hasNumberPattern(regExp: string|RegExp) {
	return regExp.toString().includes(BRACED_NUMBER_PATTERN);
}

export function getNumberPatternsCount(regExp: string|RegExp) {
	return regExp.toString().split(BRACED_NUMBER_PATTERN).length - 1;
}

export function regExpToString(regExp: RegExp) {
	return regExp
		.toString()
		.replace(/^\/|\/$/g, '');
}

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

export function numberToDigits(num: string|number) {
	return Array.from(num.toString()).map(Number);
}
