import {
	IBrowserVersionedRegExp
} from '../useragent';

export const DIGIT_PATTERN = '\\d';
export const NUMBER_PATTERN = `${DIGIT_PATTERN}+`;
export const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`;
export const ESCAPE_SYMBOL = '\\';

/**
 * Join RegExp parts with "or".
 * @param parts - Some RegExp parts.
 * @param wrapRequired - Should always wrap with braces.
 * @returns Joined parts.
 */
export function joinParts(parts: string[], wrapRequired = false) {
	const joined = parts.join('|');

	return wrapRequired || parts.length > 1
		? `(${joined})`
		: joined;
}

/**
 * Join RegExps with "or".
 * @param versionedBrowsersRegExps - RegExps strings array.
 * @returns Joined RegExps string.
 */
export function joinVersionedBrowsersRegExps(versionedBrowsersRegExps: IBrowserVersionedRegExp[]) {
	return versionedBrowsersRegExps
		.map(_ => `(${_.regExpString})`)
		.join('|');
}

/**
 * Contains number pattern or not.
 * @param regExp - Target string or RegExp.
 * @returns Has or not.
 */
export function hasNumberPattern(regExp: string|RegExp) {
	return regExp.toString().includes(BRACED_NUMBER_PATTERN);
}

/**
 * Find number patterns count.
 * @param regExp - Target string or RegExp.
 * @returns Number patterns count.
 */
export function getNumberPatternsCount(regExp: string|RegExp) {
	return regExp.toString().split(BRACED_NUMBER_PATTERN).length - 1;
}

/**
 * Convert RegExp to string without slashes.
 * @param regExp - Target RegExp.
 * @returns RegExp string without slashes.
 */
export function regExpToString(regExp: RegExp) {
	return regExp
		.toString()
		.replace(/^\/|\/$/g, '');
}

/**
 * Replace number patterns.
 * @param regExp - Target RegExp.
 * @param numbers - Number patterns to paste.
 * @param numberPatternsCount - Number patterns count to replace.
 * @returns RegExp string with replaced number patterns.
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
 * @param num - Target number.
 * @returns Digits array.
 */
export function numberToDigits(num: string|number) {
	return Array.from(num.toString()).map(Number);
}

/**
 * Skip every char inside square braces.
 * @param skip - Current skip state.
 * @param prevChar - Previous char.
 * @param char - Current char to check.
 * @returns Should skip this char or not.
 */
export function skipSquareBraces(skip: boolean, prevChar: string, char: string) {
	if (char === '['
		&& prevChar !== ESCAPE_SYMBOL
	) {
		return true;
	}

	if (char === ']'
		&& prevChar !== ESCAPE_SYMBOL
	) {
		return false;
	}

	return skip;
}

/**
 * Get possible RegExp group postfix.
 * @param regExpStr - Whole RegExp string.
 * @param startFrom - Index to start capture.
 * @returns RegExp group postfix part.
 */
export function capturePostfix(regExpStr: string, startFrom: number) {
	let char = regExpStr[startFrom];

	switch (char) {
		case '+':
		case '*':
		case '?':
			return char;

		case '(': {
			const nextChar = regExpStr[startFrom + 1];
			const afterNextChar = regExpStr[startFrom + 2];

			if (
				nextChar !== '?'
				|| afterNextChar !== '=' && afterNextChar !== '!'
			) {
				return '';
			}

			break;
		}

		case '{':
			break;

		default:
			return '';
	}

	const regExpStrLength = regExpStr.length;
	let prevChar = '';
	let braceBalance = 0;
	let skip = false;
	let postfix = '';

	for (let i = startFrom; i < regExpStrLength; i++) {
		char = regExpStr[i];
		prevChar = regExpStr[i - 1];
		skip = skipSquareBraces(skip, prevChar, char);

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& (
				char === '('
				|| char === '{'
			)
		) {
			braceBalance++;
		}

		if (braceBalance > 0) {
			postfix += char;
		}

		if (!skip
			&& prevChar !== ESCAPE_SYMBOL
			&& braceBalance > 0
			&& (
				char === ')'
				|| char === '}'
			)
		) {
			braceBalance--;

			if (braceBalance === 0) {
				break;
			}
		}
	}

	return postfix;
}
