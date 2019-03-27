import {
	DIGIT_PATTERN,
	NUMBER_PATTERN,
	numberToDigits
} from './util';

/**
 * Get digit pattern.
 * @param  digit - Ray start.
 * @param  includes - Include start digit or use next.
 * @return Digit pattern.
 */
export function rayRangeDigitPattern(digit: number, includes: boolean) {

	const rangeStart = digit + Number(!includes);
	if (rangeStart === 0) {
		return DIGIT_PATTERN;
	}

	if (rangeStart === 9) {
		return '9';
	}

	if (rangeStart > 9) {
		return '';
	}

	return `[${rangeStart}-9]`;
}

function filterDigitPattern(pattern: string) {
	return pattern === DIGIT_PATTERN;
}

/**
 * Reduce number patterns by removing useless patterns.
 * @todo   Is it still useful?
 * @param  raysNumberPatterns - Number patterns to filter.
 * @return Optimized number patterns.
 */
export function optimizeRaysNumberPatterns(raysNumberPatterns: string[][]) {

	let prev: string[] = [];
	let partsCount = 0;
	let prevPartsCount = 0;

	return raysNumberPatterns.filter((digitsPatterns, i) => {

		if (i > 0) {

			partsCount = digitsPatterns.filter(filterDigitPattern).length;
			prevPartsCount = prev.filter(filterDigitPattern).length;

			if (partsCount <= prevPartsCount) {
				return false;
			}
		}

		prev = digitsPatterns;

		return true;
	});
}

/**
 * Create numeric ray pattern.
 * @param  from - Start from this number.
 * @return Numeric ray pattern parts.
 */
export function rayToNumberPatterns(from: number) {

	if (from === 0) {
		return [NUMBER_PATTERN];
	}

	const digits = numberToDigits(from);
	const digitsCount = digits.length;
	const other = `${DIGIT_PATTERN}{${digitsCount + 1},}`;
	const zeros = digitsCount - 1;

	if (from / Math.pow(10, zeros) === digits[0]) {
		return [
			`${
				rayRangeDigitPattern(digits[0], true)
			}${
				DIGIT_PATTERN.repeat(zeros)
			}`,
			other
		];
	}

	const raysNumberPatterns = optimizeRaysNumberPatterns(
		digits.map((_, i) => {

			const ri = digitsCount - i - 1;
			const d = i <= 0;
			let prev = ' ';

			return digits.map<string>((digit, j) => {

				if (j < ri) {
					return digit.toString();
				}

				if (!prev) {
					return '';
				}

				if (j > ri) {
					return DIGIT_PATTERN;
				}

				prev = rayRangeDigitPattern(digit, d);

				return prev;
			});
		})
	);
	const numberPatterns = raysNumberPatterns.map(_ => _.join(''));

	numberPatterns.push(other);

	return numberPatterns;
}
