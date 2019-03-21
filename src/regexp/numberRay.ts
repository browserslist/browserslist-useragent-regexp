import {
	DIGIT_PATTERN,
	numberToDigits
} from './util';

export function rayRangeNumberPattern(num: number, includes: boolean) {

	const rangeStart = num + Number(!includes);

	if (rangeStart === 0) {
		return DIGIT_PATTERN;
	}

	if (rangeStart === 9) {
		return '9';
	}

	return `[${rangeStart}-9]`;
}

function filterNumberPattern(pattern: string) {
	return pattern === DIGIT_PATTERN;
}

export function optimizeRaysNumberPatterns(raysNumberPatterns: string[][]) {

	let prev: string[] = [];
	let numberPatternCount = 0;
	let prevNumberPatternCount = 0;

	return raysNumberPatterns.filter((numberPatterns, i) => {

		if (i > 0) {

			numberPatternCount = numberPatterns.filter(filterNumberPattern).length;
			prevNumberPatternCount = prev.filter(filterNumberPattern).length;

			if (numberPatternCount <= prevNumberPatternCount) {
				return false;
			}
		}

		prev = numberPatterns;

		return true;
	});
}

export function rayToNumberPatterns(from: number) {

	const digits = numberToDigits(from);
	const digitsCount = digits.length;
	const raysNumberPatterns = optimizeRaysNumberPatterns(
		digits.map((_, i) => {

			const ri = digitsCount - i - 1;
			const d = Number(i > 0);

			return digits.map<string>((digit, j) => (
				j < ri
					? digit.toString()
					: j > ri
						? '\\d'
						: rayRangeNumberPattern(digit, j + d <= ri)
			));
		})
	);
	const numberPatterns = raysNumberPatterns.map(_ => _.join(''));

	numberPatterns.push(`\\d{${digitsCount + 1},}`);

	return numberPatterns;
}
