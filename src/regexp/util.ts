export const NUMBER_PATTERN = '\\d+';
export const BRACED_NUMBER_PATTERN = `(${NUMBER_PATTERN})`;
export const ESCAPE_SYMBOL = '\\';

export function join(parts: string[], wrapRequired = false) {

	const joined = parts.join('|');

	return wrapRequired || parts.length
		? `(${joined})`
		: joined;
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

export function replaceNumberPatterns(regExp: RegExp, numbers: string[]) {

	const strRegExp = regExpToString(regExp);
	const numberedStrRegExp = numbers.reduce(
		(_, num) => _.replace(BRACED_NUMBER_PATTERN, num),
		strRegExp
	);

	return numberedStrRegExp;
}

export function numberToDigits(num: string|number) {
	return Array.from(num.toString()).map(Number);
}
